import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';
import {ButtonModule} from 'primeng/components/button/button';
import {InputTextModule} from 'primeng/components/inputtext/inputtext';

import {LoginFormComponent} from './login-form/login-form.component';
import {SegurancaRoutingModule} from './seguranca-routing.module';
import {AuthGuard} from './auth.guard';
import {LogoutService} from './logout.service';
import {JwtConfigService, jwtOptionsFactory} from './jwt-config.service';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,

    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [JwtConfigService],
      }
    }),
    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  providers: [
    AuthGuard,
    LogoutService,
    JwtConfigService
  ]
})
export class SegurancaModule {
}
