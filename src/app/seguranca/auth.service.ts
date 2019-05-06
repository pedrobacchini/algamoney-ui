import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {environment} from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
import {JwtHelper} from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: Http,
    private jwtHelper: JwtHelper
  ) {
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {

    const  headers = new Headers();
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return  this.http.post(this.oauthTokenUrl, body, {headers})
      .toPromise()
      .then(response => {
        this.armazenarToken(response.json().access_token);
      })
      .catch(response => {
        console.log(response);
        if (response.status === 400) {
          const  responseJson = response.json();

          if (responseJson.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response);
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
}
