import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, Subscription, throwError } from 'rxjs';
import { UsersDomainService } from './domain-services';
import { ElistsDomainService } from './domain-services/services/elists.domain-service';

@Component({
  selector: 'looper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  subs: Subscription[] = [];

  constructor(
    private _usersDomainService: UsersDomainService,
    private _elistDomainService: ElistsDomainService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._usersDomainService.load().subscribe();

    this.subs.push(
      this._usersDomainService.user$
        .pipe(filter((u) => !!u?.data))
        .subscribe(() => {
          this._elistDomainService.load().subscribe();
          this._router.navigate(['elists']);
        })
    );
  }

  ngOnDestroy() {
    this._usersDomainService.unload();

    this.subs.forEach((s) => s.unsubscribe());
  }
}
