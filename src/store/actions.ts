import { Action } from '@ngrx/store';
import {Credentials} from '../drf-jwt-auth.models';
import {JWT} from '../jwt';

export enum DRFJWTAuthActionTypes {
  RenewToken = '[DRF JWT Auth] Renew Token',
  SaveToken = '[DRF JWT Auth] Save Token',
  RemoveToken = '[DRF JWT Auth] Remove Token',
  AuthFail = '[DRF JWT Auth] Auth Fail',
  LogIn = '[DRF JWT Auth] LogIn',
  LogOut = '[DRF JWT Auth] LogOut',
  LogInSuccess = '[DRF JWT Auth] Login Success',
  ForgottenPassword = '[DRF JWT Auth] Forgotten Password',
  SignUp = '[DRF JWT Auth] SignUp',

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

export class ForgottenPassword implements Action {
  public readonly type = DRFJWTAuthActionTypes.ForgottenPassword;
}

export class SignUp implements Action {
  public readonly type = DRFJWTAuthActionTypes.SignUp;
}

export type DRFJWTAuthActions =
  | SaveToken
  | RenewToken
  | RemoveToken
  | AuthFail
  | LogIn
  | LogOut
  | LogInSuccess
  | ForgottenPassword
  | SignUp;
