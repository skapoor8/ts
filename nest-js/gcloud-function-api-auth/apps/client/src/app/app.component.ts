import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, Subscription, throwError } from 'rxjs';
import { UsersDomainService } from './domain-services';
import { ElistsDomainService } from './domain-services/services/elists.domain-service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserRole } from '@gcloud-function-api-auth/interfaces';

@Component({
  selector: 'looper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'flex flex-col h-screen bg-slate-100',
  },
})
export class AppComponent implements OnInit, OnDestroy {
  public user$ = this._auth.user;
  title = 'client';
  subs: Subscription[] = [];

  constructor(
    private _usersDomainService: UsersDomainService,
    private _elistDomainService: ElistsDomainService,
    private _router: Router,
    private _auth: AngularFireAuth
  ) {}

  ngOnInit() {
    // this._usersDomainService.load().subscribe();

    this.subs.push(
      this._auth.authState.subscribe({
        next: async (s) => {
          console.log('auth state changed:', s);
          if (s) {
            const token = await s?.getIdTokenResult();
            console.log('token:', token);
            this._usersDomainService
              .load(
                token?.claims['looper_user_role'] === UserRole.ADMIN,
                token?.claims['looper_user_id']
              )
              .subscribe();
          }
        },
      }),
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

  // event handlers ----------------------------------------------------------------------------------------------------

  public handleAuthSuccess(data: any) {
    console.log('Signed in:', data);
    // const uid = data[]
  }

  public handleAuthFailure(data: any) {
    console.error('Sign-in failed:', data);
  }
}
