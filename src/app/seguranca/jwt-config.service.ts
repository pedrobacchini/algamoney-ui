import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export function jwtOptionsFactory(jwtConfig: JwtConfigService) {
  return {
    tokenGetter: tokenGetter,
    whitelistedDomains: jwtConfig.whitelistedDomains,
    blacklistedRoutes: jwtConfig.blacklistedRoutes,
    skipWhenExpired: false
  };
}

@Injectable({
  providedIn: 'root'
})
export class JwtConfigService {

  public whitelistedDomains: (string|RegExp)[];
  public blacklistedRoutes: (string|RegExp)[];

  constructor() {
    this.whitelistedDomains = [environment.tokenWhitelistedDomains];
    this.blacklistedRoutes = [/\/oauth\/token/];
  }
}
