import {Inject, Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import {map, take, switchMap, catchError, withLatestFrom, tap} from 'rxjs/operators';
import * as DRFJWTAuthActions from './actions';

import {Router} from '@angular/router';
import {DRFJWTAuthService} from '../drf-jwt-auth.service';
import {Credentials} from '../drf-jwt-auth.models';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import {JWT} from '../jwt';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/state'
import {DRF_JWT_AUTH_OPTIONS, IDrfJwtAuthOptions} from '../drf-jwt-auth.options';
import {ROUTER_NAVIGATION} from '@ngrx/router-store';
import {RenewToken, SaveToken} from './actions';
import {selectAuthState} from './reducers';

// TODO: Can I register the effects outside of main application? Not in app.module.ts

@Injectable()
export class DRFJWTAuthEffects {
  public options : IDrfJwtAuthOptions;

  constructor(
    private actions$: Actions,
    private authService: DRFJWTAuthService,
    private router: Router,
    private store: Store<AppState>,
    @Inject(DRF_JWT_AUTH_OPTIONS) options: IDrfJwtAuthOptions) {

    this.options = options;

  }

    //TODO: we want to be ables to specify the location of the store (define from above at init). Since everyone might not have the same setup



  /**
   * When getting a token we need to get the user and password and request a new token from the server and save it to the state
   * and use the token for authenticating requests against the server
   **/
  @Effect()
  public logIn: Observable<Action> = this.actions$
    .ofType(DRFJWTAuthActions.DRFJWTAuthActionTypes.LogIn)
    .pipe(
      map((action: DRFJWTAuthActions.LogIn) => action.payload),                // Credentials is payload
      switchMap((cred: Credentials) => this.authService.GetToken(cred)
        .pipe(
          tap( (data : JWT) => this.authService.saveTokenToLocalStorage(data)),
          map((data: JWT) => new DRFJWTAuthActions.SaveToken(data)),
          tap(() => this.store.dispatch(new DRFJWTAuthActions.LogInSuccess())),//todo: dispatch LoginSuccess Action
          catchError( err => of(new DRFJWTAuthActions.AuthFail(err))),
        )
      ),
    );

  @Effect()
  /**
   * We need to update the token before it gets to old. Then we can just use the current token.
   * On SaveToken we wait for a time and then refreshes the token automatically.
   **/
  public autoRenewToken$: Observable<Action> = this.actions$
    .ofType(DRFJWTAuthActions.DRFJWTAuthActionTypes.SaveToken)
    .pipe(
      switchMap(() => Observable.timer(this.options.JwtRefreshRate)), //wait for update   //TODO: Be able to configure refresh time.
      withLatestFrom(this.store.select(selectAuthState).map(state => state.jwt)),  //get current token
      switchMap(([timer, jwt]: [number, JWT]) => {
        // If we have logged out we should not refresh the token.
        if (jwt) {
          return this.authService.RefreshToken(jwt.token)  //call API.
            .pipe(
              tap( (data : JWT) => this.authService.saveTokenToLocalStorage(data)),
              map((data: JWT) => new DRFJWTAuthActions.SaveToken(data)),
              catchError( err => of(new DRFJWTAuthActions.AuthFail(err)),
              )
            )
        }
        else { return Observable.empty()}
      }
      )
    );



  @Effect()
  /**
   * We want to be able to update the token when we want to.
   **/
  public renewToken$: Observable<Action> = this.actions$
    .ofType(DRFJWTAuthActions.DRFJWTAuthActionTypes.RenewToken)
    .pipe(
      withLatestFrom(this.store.select(selectAuthState).map(state => state.jwt)),  //get current token
      switchMap(([action, jwt]: [DRFJWTAuthActions.RenewToken, JWT]) => {
          // If we have logged out we should not refresh the token.
          if (jwt) {
            return this.authService.RefreshToken(jwt.token)  //call API.
              .pipe(
                tap( (data : JWT) => this.authService.saveTokenToLocalStorage(data)),
                map((data: JWT) => new DRFJWTAuthActions.SaveToken(data)),
                catchError( err => of(new DRFJWTAuthActions.AuthFail(err)),

                )
              )
          }
          else { return Observable.empty()}
        }
      )
    );


  /**
   * An effect that will map logout to remove the token. So developers can hook up other events on logOut.
   * @type {Observable<RemoveToken>}
   */
  @Effect()
  public  logOut$: Observable<Action> = this.actions$
    .ofType(DRFJWTAuthActions.DRFJWTAuthActionTypes.LogOut)
    .pipe(
      tap( () => this.authService.deleteTokenFromLocalStorage()),
      map(() => new DRFJWTAuthActions.RemoveToken())
    );


  /**
   * A way to get an action after the app as inited to check if there is a valid token in local storage and set it in the state.
   * Also renew the token so that we have a fresh one.
   * @type {Observable<any>}
   */
  @Effect({dispatch: false})
  public firstAction: Observable<Action> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      take(1),
      tap(() => {
        let jwt = this.authService.readTokenFromLocalStorage();
        if (jwt) {
          this.store.dispatch(new SaveToken(jwt));
          this.store.dispatch( new RenewToken());
        }
      },
    )
    )

}
