import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/state';  // TODO: THis should be a derrived state.
import {Go} from '../../app/state/router/actions';
import {DRFJWTAuthService} from './drf-jwt-auth.service';

@Injectable()
export class CanActivateIfAuthenticated implements CanActivate {


  constructor(private auth: DRFJWTAuthService, private store: Store<AppState>) {}


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
