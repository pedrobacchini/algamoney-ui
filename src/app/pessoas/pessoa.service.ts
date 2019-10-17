import {Headers, Http, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {Pessoa} from '../core/model';
import {environment} from '../../environments/environment';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 3;
}

@Injectable()
export class PessoaService {

  pessoasUrl = `${environment.baseUrl}/pessoas`;

  constructor(private http: Http) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const params = new URLSearchParams();
    const headers = new Headers();

    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrl}?resumo`,
      { headers, search: params })
    .toPromise()
    .then(response => {
      const responseJson = response.json();
      const pessoas = responseJson.content;

      return {
        pessoas,
        total: responseJson.totalElements
      };

    });
  }

  listarTodas(): Promise<any> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(this.pessoasUrl, { headers })
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(id: number): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete(`${this.pessoasUrl}/${id}`, { headers })
      .toPromise()
      .then(() => null);
  }

  mudarStatus(id: number, ativo: boolean): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${id}/ativo`, ativo, {headers})
    .toPromise()
    .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.pessoasUrl, JSON.stringify(pessoa), { headers })
      .toPromise()
      .then(response => response.json());
  }

  atualizar (pessoa: Pessoa): Promise<Pessoa> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${pessoa.id}`,
        JSON.stringify(pessoa), { headers })
          .toPromise()
          .then(response => response.json() as Pessoa);
  }

  buscarPorId(id: number): Promise<Pessoa> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.pessoasUrl}/${id}`, { headers })
    .toPromise()
    .then(response => response.json() as Pessoa);
  }
}
