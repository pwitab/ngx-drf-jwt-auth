import { Action } from '@ngrx/store';

import {Credentials} from '../models';
import {JWT} from '../jwt';

export enum DRFJWTAuthActionTypes {
  RenewToken = '[DRF JWT Auth] Renew Token',
  SaveToken = '[DRF JWT Auth] Save Token',
  RemoveToken = '[DRF JWT Auth] Remove Token',
  AuthFail = '[DRF JWT Auth] Auth Fail',
  LogIn = '[DRF JWT Auth] LogIn',
  LogOut = '[DRF JWT Auth] LogOut',
  LogInSuccess = '[DRF JWT Auth] Login Success',
  GoToForgottenPassword = '[DRF JWT Auth] Go To Forgotten Password',
  GoToSignUp = '[DRF JWT Auth] Go To SignUp',
  GoToSignIn = '[DRF JWT Auth] Go To SignIn',

}



export class LogIn implements Action {
  public readonly type = DRFJWTAuthActionTypes.LogIn;

  constructor(public payload: Credentials)  {
  }
}

export class RenewToken implements Action {
  public readonly type = DRFJWTAuthActionTypes.RenewToken;
}




export class LogOut implements Action {
  public readonly type = DRFJWTAuthActionTypes.LogOut;
}

export class LogInSuccess implements Action {
  public readonly type = DRFJWTAuthActionTypes.LogInSuccess;
}

export class SaveToken implements Action {
  public readonly type = DRFJWTAuthActionTypes.SaveToken;

  constructor(public payload: JWT) {
  }

}

export class RemoveToken implements Action {
  public readonly type = DRFJWTAuthActionTypes.RemoveToken;
}

export class AuthFail implements Action {
  public readonly type = DRFJWTAuthActionTypes.AuthFail;

  constructor(public payload: string) {}
}

export class GoToForgottenPassword implements Action {
  public readonly type = DRFJWTAuthActionTypes.GoToForgottenPassword;
}

export class GoToSignUp implements Action {
  public readonly type = DRFJWTAuthActionTypes.GoToSignUp;
}

export class GoToSignIn implements Action {
    public readonly type = DRFJWTAuthActionTypes.GoToSignIn;
}


export type DRFJWTAuthActions =
  | SaveToken
  | RenewToken
  | RemoveToken
  | AuthFail
  | LogIn
  | LogOut
  | LogInSuccess
  | GoToForgottenPassword
  | GoToSignIn
    | GoToSignUp;
