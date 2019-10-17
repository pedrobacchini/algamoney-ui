import {Headers, Http, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import {Lancamento} from 'src/app/core/model';
import {environment} from '../../environments/environment';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

  constructor(private http: Http) { }

  lancamentosUrl = `${environment.baseUrl}/lancamentos`;

  private static converterStringParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

        if (lancamento.dataPagamento) {
          lancamento.dataPagamento = moment(lancamento.dataPagamento,
            'YYYY-MM-DD').toDate();
        }
    }
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const params = new URLSearchParams();
    const headers = new Headers();

    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params.set('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
        console.log(filtro.dataVencimentoInicio);
    }

    if (filtro.dataVencimentoFim) {
      params.set('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
        console.log(filtro.dataVencimentoFim);
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`,
        { headers, search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const lancamentos = responseJson.content;

        return {
          lancamentos,
          total: responseJson.totalElements
        };
      });
  }

  excluir(id: number): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete(`${this.lancamentosUrl}/${id}`, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.lancamentosUrl,
       JSON.stringify(lancamento), { headers })
      .toPromise()
      .then(response => response.json());
  }

  atualizar (lancamento: Lancamento): Promise<Lancamento> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.lancamentosUrl}/${lancamento.id}`,
        JSON.stringify(lancamento), { headers })
          .toPromise()
          .then(response => {
            const lancamentoAlterado = response.json() as Lancamento;

            LancamentoService.converterStringParaDatas([lancamentoAlterado]);

            return lancamentoAlterado;
          });
  }

  buscarPorId(id: number): Promise<Lancamento> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.lancamentosUrl}/${id}`, { headers })
    .toPromise()
    .then(response => {
      const lancamento = response.json() as Lancamento;

      LancamentoService.converterStringParaDatas([lancamento]);

      return lancamento;
    });
  }
}
