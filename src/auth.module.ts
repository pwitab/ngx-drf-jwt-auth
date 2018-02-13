import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {EffectsModule} from '@ngrx/effects';
import {DRFJWTAuthEffects} from './store/effects';
import {StoreModule} from '@ngrx/store';

import {DRFJWTLoginFormComponent} from './components/loginform.component';
import {DRF_JWT_AUTH_OPTIONS, IDrfJwtAuthOptions} from './options';
import {DrfJwtAuthInterceptor} from './auth.interceptor';
import {CanActivateIfAuthenticated} from './guard.service';
import {DRFJWTAuthService} from './auth.service';
import {authReducer} from './store/reducers';

@NgModule({
  declarations: [DRFJWTLoginFormComponent],
  imports: [CommonModule, ReactiveFormsModule, EffectsModule.forFeature([DRFJWTAuthEffects]),
    StoreModule.forFeature('auth', authReducer)
    ],
  exports: [DRFJWTLoginFormComponent]
})
export class DrfJwtAuthBaseModule {

}


export class DrfJwtAuthModule {

  constructor(@Optional() @SkipSelf() parentModule: DrfJwtAuthModule) {
    if (parentModule) {
      throw new Error('DrfJwtAuthModule is already loaded. It should only be imported in your application\'s main module.');
    }
  }
  static forRoot(options: IDrfJwtAuthOptions): ModuleWithProviders {
    return {
      ngModule: DrfJwtAuthBaseModule,

      providers: [
        {provide: DRF_JWT_AUTH_OPTIONS, useValue: options},
        {provide: HTTP_INTERCEPTORS, useClass: DrfJwtAuthInterceptor, multi: true},
        DRFJWTAuthService,
        CanActivateIfAuthenticated,
      ]
    };
  }
}

