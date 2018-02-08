import {createFeatureSelector, MemoizedSelector} from '@ngrx/store';


import {DRFJWTAuthActions, DRFJWTAuthActionTypes} from './actions';
import {JWT} from '../jwt'

//TODO: is it possible to register state in the module using StoreModule.forFeature().

export const selectAuthState = createFeatureSelector<State>('auth');

export interface AuthState {
  auth: State
}

export interface State {
  jwt: JWT;
  login_error: boolean
}

export function getInitialState() : State {
  return {
    jwt: null,
    login_error: false,
  }
}

export function authReducer(state: State = getInitialState(), action: DRFJWTAuthActions): State {
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


