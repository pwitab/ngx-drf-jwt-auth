import {InjectionToken} from '@angular/core';


export interface IDrfJwtAuthOptions {
  JwtRefreshRate : number;
  TokenPrefix : string;
  AuthApiBaseUrl : string;
  RequestTokenEndpoint : string;
  RefreshTokenEndpoint : string;
  LocalStorageTokenKey : string;
}


/**
 * Injector token to use to inject options and config to the module.
 */
export const DRF_JWT_AUTH_OPTIONS = new InjectionToken<IDrfJwtAuthOptions>('DRF_JWT_AUTH_OPTIONS');


