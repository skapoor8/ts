import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { catchError, tap, throwError } from 'rxjs';
import { UsersHttpService } from '../../http-services';
import { DomainServiceUtils, ErrorUtils } from '../../shared';
import { DataStore } from '../../stores';
import { DomainServiceLoadableStatus } from '../enums';
import {
  DomainServiceMissingDataError,
  DomainServiceRequestFailedError,
} from '../errors';

@Injectable()
export class ElistsDomainService {
  // state -------------------------------------------------------------------------------------------------------------
  public userElists$ = this._dataStore.userElists$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _dataStore: DataStore,
    private _usersHttpService: UsersHttpService,
    private _logger: NGXLogger
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public load() {
    return this.getElistsForUser();
  }

  public unload() {
    this._dataStore.setUserElists(DomainServiceUtils.createIdleLoadable([]));
  }

  /**
   * Gets elist for user selected in the DataStore
   *
   * @returns observable list of elists
   *
   * @throws DomainServiceMissingDataError if user was not set in DataStore
   * @throws DomainServiceRequestFailedError (in observable) if request failed
   */
  public getElistsForUser() {
    const user = this._dataStore.getUser();
    if (!user?.data?.id) {
      throw new DomainServiceMissingDataError(
        'user$ is missing from DataStore'
      );
    }

    this._dataStore.setUserElists(
      DomainServiceUtils.createEmptyLoadable(
        DomainServiceLoadableStatus.LOADING,
        []
      )
    );
    return this._usersHttpService.getUserElists(user.data.id).pipe(
      tap((data) => {
        this._dataStore.setUserElists(
          DomainServiceUtils.createCompleteLoadable(data)
        );
        this._logger.info('elists loaded:', data);
      }),
      catchError((e) => {
        this._logger.error('getElistsForUser failed');
        this._dataStore.setUserElists(
          DomainServiceUtils.createEmptyLoadable(
            DomainServiceLoadableStatus.FAILED,
            []
          )
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('getElistsForUser failed', e)
            )
        );
      })
    );
  }
}
