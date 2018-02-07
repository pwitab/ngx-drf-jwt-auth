import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppStore from '../../app/state';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DRFJWTAuthService} from './drf-jwt-auth.service';
import {Credentials} from './drf-jwt-auth.models';
import * as Auth from './store/actions';
import {JWT} from './jwt';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {selectAuthState} from './store/reducers';


const checkLoggedInJWT = map((jwt: JWT) => {
    if (jwt) {
      return jwt.isValid();
    }
    else {return false}
}
);


@Component({
  selector: 'drf-jwt-login-form',
  template: `  
    <h3>Log In</h3>
    <div *ngIf="(login_error | async) " class="alert-danger">
      Could not login with provided credentials. Please try again.
    </div>
    <div *ngIf="(logged_in | async) == false; else LoggedInInfo">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="center-block">Email</label>
              <input class="form-control" type="email" formControlName="username" placeholder="Enter email" required autocomplete="email">
            
            <div class="alert-warning" *ngIf="loginForm.controls['username'].invalid && loginForm.controls['username'].dirty">
              <p *ngIf="loginForm.controls['username'].hasError('email')"> Enter a valid email</p>
            </div>
            
            <label class="center-block">Password</label>
              <input class="form-control" type="password" formControlName="password" placeholder="Enter password" required autocomplete="current-password">
            
          </div>
        <div>
          <button  type="button" (click)="signUpClicked()" class="btn btn-outline-info">Sign Up</button>
          <button type="submit" [disabled]="loginForm.invalid" class="btn btn-success">Log In</button><br>
          <button  type="button" (click)="forgottenPasswordClicked()" class="btn btn-link">Forgotten Password</button>

        </div>
          
        </form>
    </div>
    <ng-template #LoggedInInfo>You are logged in</ng-template>
    <div *ngIf="logged_in | async">
      <button (click)="logOut()" class="btn btn-danger">Log Out!</button>
    </div>
  `,
  styles: [],

})
export class DRFJWTLoginFormComponent {

  loginForm: FormGroup;
  jwt: Observable<JWT>;
  login_error: Observable<boolean>;
  logged_in: Observable<boolean>;


  constructor(private store: Store<AppStore.AppState>,
              private authService: DRFJWTAuthService,
              private formBuilder: FormBuilder) {

    this.login_error = this.store.select(selectAuthState).map(state => state.login_error);
    this.jwt = this.store.select(selectAuthState).map(state => state.jwt);

    this.logged_in = this.jwt.pipe(checkLoggedInJWT);


    this.CreateLoginForm();
  }

  CreateLoginForm() {
    this.loginForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      }
    )
  }

  onSubmit() {
    let form = this.loginForm.value;
    this.store.dispatch(new Auth.LogIn(new Credentials(form.username, form.password)));

    this.loginForm.reset();
    // TODO: add change page on login.

  }

  logOut() {
    console.log('logOut');
    this.store.dispatch(new Auth.LogOut());
  }

  signUpClicked() {
    this.store.dispatch(new Auth.SignUp());
  }

  forgottenPasswordClicked() {
    this.store.dispatch(new Auth.ForgottenPassword());
  }
}
