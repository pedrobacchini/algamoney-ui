import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';

@Injectable()
export class CategoriaService {

  categoriasUrl = `${environment.baseUrl}/categorias`;

  constructor(private http: Http) { }

  listarTodas(): Promise<any> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(this.categoriasUrl, { headers })
    .toPromise()
    .then(response => response.json());
  }

}
