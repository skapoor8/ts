import { Injectable } from '@angular/core';
import { ElistsDomainService } from '../../../domain-services';

@Injectable()
export class ElistsPresenter {
  // state -------------------------------------------------------------------------------------------------------------
  public readonly userElists$ = this._elistsDomainService.userElists$;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _elistsDomainService: ElistsDomainService) {}

  // api ---------------------------------------------------------------------------------------------------------------
}
