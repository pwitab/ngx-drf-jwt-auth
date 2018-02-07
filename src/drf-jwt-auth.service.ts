import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {Credentials} from './drf-jwt-auth.models';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/do';

import {JWT} from './jwt';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/state'
import {Subscription} from 'rxjs/Subscription';
import {DRF_JWT_AUTH_OPTIONS, IDrfJwtAuthOptions} from './drf-jwt-auth.options';
import {selectAuthState} from './store/reducers';

export interface TokenResponse {
  token: string
}

@Injectable()
export class DRFJWTAuthService {

  public jwt$ : Subscription;
  public authenticated :boolean;
  public options: IDrfJwtAuthOptions;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    @Inject(DRF_JWT_AUTH_OPTIONS) options: IDrfJwtAuthOptions,) {

    this.options = options;
    this.jwt$ = this.store.select(selectAuthState).map(state => state.jwt).subscribe(jwt => {
      if (jwt) {this.authenticated = jwt.isValid()}
      else {this.authenticated = false}});

  }

  public GetToken(credentials: Credentials): Observable<JWT> {
    let url = this.options.AuthApiBaseUrl + this.options.RequestTokenEndpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let body = {
      'username': credentials.username,
      'password': credentials.password
    };
    return this.http.post<TokenResponse>(url, body, {headers})
      .pipe(
      map((res) => {
        return new JWT(res.token);
      })
    );


  }

  // TODO: get the token from the store to use in the request.
  public RefreshToken(currentToken: string) {
    let url = this.options.AuthApiBaseUrl + this.options.RefreshTokenEndpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let body = {
      'token': currentToken
    };
    return this.http.post<TokenResponse>(url, body, {headers})
      .pipe(
        map((res) => new JWT(res.token))
    )

  }

  public isAuthenticated() : boolean {
    return this.authenticated
  }

  public saveTokenToLocalStorage(jwt: JWT) {
    try {
      localStorage.setItem(this.options.LocalStorageTokenKey, jwt.token);
      console.log('Saved ' + jwt.token);
    }
    catch (e) {
      console.log(e)
    }
  }

  public readTokenFromLocalStorage() : JWT {

    try {
      let token = localStorage.getItem(this.options.LocalStorageTokenKey);
      if (token) {
        let jwt = new JWT(token);
        if (jwt.isValid()) {
          return jwt;
        }
        else {
          this.deleteTokenFromLocalStorage();
          return null;
        }
      }
      else {return null;}
    }

    catch (e) {
      console.log(e);
      return null;
    }

  }

  public deleteTokenFromLocalStorage() {
    try {
      localStorage.removeItem(this.options.LocalStorageTokenKey)
    }
    catch (e) {
      console.log(e)
    }
    }
}

