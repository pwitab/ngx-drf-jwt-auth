import {Inject, Injectable} from '@angular/core';
import {AppState} from '../../app/state';
import {Subscription} from 'rxjs/Subscription';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';

import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';


import {JWT} from './jwt';
import {DRF_JWT_AUTH_OPTIONS, IDrfJwtAuthOptions} from './options';
import {selectAuthState} from './store/reducers';

@Injectable()
export class DrfJwtAuthInterceptor implements HttpInterceptor {

  public jwt : Subscription;
  public token : string;
  public options: IDrfJwtAuthOptions;

  constructor(
    private store: Store<AppState>,
    @Inject(DRF_JWT_AUTH_OPTIONS) options: IDrfJwtAuthOptions){

    this.options = options;
    this.jwt =  this.store.select(selectAuthState).map(state => state.jwt)
      .subscribe(jwt => {
        if (jwt) {this.token = jwt.token}
        else {this.token = null}});
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log(`[${new Date().toString()}] Request to ${request.url}`);

    let newHeaders = {};

    if (this.token) {newHeaders = {Authorization: this.options.TokenPrefix + '' + this.token}}

    const postReq = request.clone({setHeaders: newHeaders});



    return next
      .handle(postReq).do(event => {

        if (event instanceof HttpResponse) {
          console.log(`[${new Date().toString()}] Received response ${event.status} - ${event.statusText}`);
          // TODO: handle logout and go to loginpage on wrong request,
        }

      })
      .catch((error, caught) => {
        //intercept the respons error and displace it to the console
        console.log("Error Occurred");
        console.log(error);
        //return the error to the method that called it
        return Observable.throw(error);
      }) as any;

  }

}
// TODO: Add deconstror that is unscubscribing

// TODO: store jwt in local storage? so that it is possible to return to a page when your token is still valid.
