import {Injectable} from '@angular/core';
import {MoneyHttp} from './money-http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  tokensRevokeUrl: string;

  constructor(private http: MoneyHttp, private auth: AuthService) {
    this.tokensRevokeUrl = `${environment.apiUrl}/token/revoke`;
  }

  logout() {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.auth.cleanAccessToken();
      });
  }
}
