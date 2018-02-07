import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Store} from '@ngrx/store';
import {Go} from '../../app/state/router/actions';
import {DRFJWTAuthService} from './auth.service';
import {AuthState} from "./store/reducers";

@Injectable()
export class CanActivateIfAuthenticated implements CanActivate {


  constructor(private auth: DRFJWTAuthService, private store: Store<AuthState>) {}


  canActivate() {

    if (this.auth.isAuthenticated()) {
      return true
    }
    else {
      this.store.dispatch(new Go({path: ['login']}));
      return false
    }
  }
}
