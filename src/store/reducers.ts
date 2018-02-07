import {DRFJWTAuthActions, DRFJWTAuthActionTypes} from './actions';
import {JWT} from '../jwt'
import {createFeatureSelector} from '@ngrx/store';

//TODO: is it possible to register state in the module using StoreModule.forFeature().

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export interface AuthState {
  jwt: JWT;
  login_error: boolean
}

export function getInitialState() : AuthState {
  return {
    jwt: null,
    login_error: false,
  }
}

export function authReducer(state: AuthState = getInitialState(), action: DRFJWTAuthActions): AuthState {
  switch (action.type) {

    // after we have gotten the token we need to save it in the state.
    case DRFJWTAuthActionTypes.SaveToken: {
      return {
        ...state,
        jwt: action.payload,
        login_error: false,
      };

    }
    // When logging out we want to remove the token.
    case DRFJWTAuthActionTypes.RemoveToken: {
      return {
        ...state,
        jwt: null,
        login_error: false,
      };

    }

    case  DRFJWTAuthActionTypes.AuthFail: {
      return {
        ...state,
        login_error: true,
      };
    }

    default: {
      return state;
    }

  }
}


