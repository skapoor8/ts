import { Injectable } from '@angular/core';
import { IUser } from '@azure-function-api-mysql/interfaces';
import { NGXLogger } from 'ngx-logger';
import { catchError, of, tap, throwError } from 'rxjs';
import { UsersHttpService } from '../../http-services/users.http-service';
import { DomainServiceUtils, ErrorUtils } from '../../shared';
import { DataStore } from '../../stores';
import { DomainServiceLoadableStatus } from '../enums';
import {
  DomainServiceInvalidSelectionError,
  DomainServiceRequestFailedError,
} from '../errors';

@Injectable()
export class UsersDomainService {
  // state -------------------------------------------------------------------------------------------------------------
  public users$ = this._dataStore.users$;
  public user$ = this._dataStore.user$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _usersHttpService: UsersHttpService,
    private _dataStore: DataStore,
    private _logger: NGXLogger
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public load() {
    return this.getUsers();
  }

  public unload() {
    this._dataStore.setUsers(DomainServiceUtils.createIdleLoadable([]));
    this._dataStore.setUser(DomainServiceUtils.createIdleLoadable(null));
  }

  /**
   * Get list of users from the backend
   *
   * @returns an observable that emits an array of IUser objects once the internal
   * request completes
   *
   * @throws DomainServiceRequestFailedError (in observable) if request fails
   */
  public getUsers() {
    this._dataStore.setUsers(
      DomainServiceUtils.createEmptyLoadable(
        DomainServiceLoadableStatus.LOADING,
        []
      )
    );
    return this._usersHttpService.getUsers().pipe(
      tap((data) => {
        this._logger.info('domain-services.users.getUsers:', data);
        this._dataStore.setUsers(
          DomainServiceUtils.createCompleteLoadable(data ?? [])
        );
      }),
      catchError((e) => {
        this._logger.error('domain-services.users.getUsers:', e);
        this._dataStore.setUsers(
          DomainServiceUtils.createEmptyLoadable(
            DomainServiceLoadableStatus.FAILED,
            []
          )
        );
        return throwError(
          () =>
            new DomainServiceRequestFailedError(
              ErrorUtils.chainError('getUsers failed', e)
            )
        );
      })
    );
  }

  /**
   * Select a user
   *
   * @throws DomainServiceInvalidSelectionError if choice is invalid
   */
  public selectUser(user: IUser) {
    this._dataStore.setUser(
      DomainServiceUtils.createEmptyLoadable(
        DomainServiceLoadableStatus.LOADING,
        null
      )
    );
    const users = this._dataStore.getUsers();
    const found = users?.data?.find((u) => u === user);
    if (users?.data?.length > 0 && found) {
      this._dataStore.setUser(DomainServiceUtils.createCompleteLoadable(found));
      this._logger.debug(
        'domain-services.users.selectUser: user selected =',
        found
      );
    } else {
      this._dataStore.setUser(
        DomainServiceUtils.createEmptyLoadable(
          DomainServiceLoadableStatus.FAILED,
          null
        )
      );
      throw new DomainServiceInvalidSelectionError(
        'Selecting a user not in DataStore.users$'
      );
    }
  }
}
