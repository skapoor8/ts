import { Injectable } from '@angular/core';
import { IUser } from '@azure-function-api-mysql/interfaces';
import { UsersDomainService } from '../../../domain-services';

@Injectable()
export class UsersPresenter {
  // state -------------------------------------------------------------------------------------------------------------
  public users$ = this._usersDomainService.users$;
  public user$ = this._usersDomainService.user$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _usersDomainService: UsersDomainService) {}

  // api ---------------------------------------------------------------------------------------------------------------
  public selectUser(user: IUser) {
    this._usersDomainService.selectUser(user);
  }
}
