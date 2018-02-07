import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Store} from '@ngrx/store';
import {DRFJWTAuthService} from './auth.service';
import {AuthState} from "./store/reducers";
import {GoToSignIn} from "./store/actions";

@Injectable()
export class CanActivateIfAuthenticated implements CanActivate {


  constructor(private auth: DRFJWTAuthService, private store: Store<AuthState>) {}


  canActivate() {

    if (this.auth.isAuthenticated()) {
      return true
    }
    else {
      this.store.dispatch(new GoToSignIn());
      return false
    }
  }
}
