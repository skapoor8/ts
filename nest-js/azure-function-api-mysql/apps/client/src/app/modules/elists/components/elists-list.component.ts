import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomainServiceLoadableStatus } from '../../../domain-services';
import { ElistsPresenter } from '../presenters';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  providers: [ElistsPresenter],
  selector: 'looper-elists-list',
  template: `
    <!-- title + actions -->
    <div class="flex flex-row items-center pb-2 border-b">
      <span class="uppercase font-semibold flex-1 text-gray-500"
        >My Elists</span
      >
      <button mat-raised-button color="primary" [routerLink]="['create']">
        New
      </button>
    </div>
    <!-- loading content -->

    <!-- if not loading -->
    <ng-container
      *ngIf="
        (userElists$ | async)?.status ===
        DomainServiceLoadableStatusEnum.COMPLETE
      "
    >
      <div
        *ngFor="let e of (userElists$ | async)?.data"
        class="w-full p-3 bg-white rounded hover:border hover:border-matDeepPurple-400"
      >
        {{ e.elistName }}
      </div>
    </ng-container>
  `,
  host: {
    class: 'flex flex-col flex-1 gap-2 w-full p-4 bg-slate-100',
  },
})
export class ElistListComponent {
  public userElists$ = this._presenter.userElists$;

  public DomainServiceLoadableStatusEnum = DomainServiceLoadableStatus;

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(private _presenter: ElistsPresenter) {}
}
