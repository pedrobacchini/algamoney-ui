import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/toPromise';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {

    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
      .append('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return  this.http.post<any>(this.oauthTokenUrl, body,
      {headers, withCredentials: true})
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token);
      })
      .catch(response => {
        console.log(response);
        if (response.status === 400) {
          if (response.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response);
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  obterNovoAcessToken() {

    const  headers = new HttpHeaders()
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
      .append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    return this.http.post<any>(this.oauthTokenUrl, body,
      {headers, withCredentials: true})
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token);
        console.log('Novo Access token criado!');
        return Promise.resolve(null);
      }).catch(response => {
        console.error('Error ao renovar token.', response);
        return Promise.resolve(null);
      });
  }

  private armazenarToken(token: string) {
    localStorage.setItem('token', token);
    this.jwtPayload = this.jwtHelper.decodeToken(token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.jwtPayload = this.jwtHelper.decodeToken(token);
    }
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }
}
