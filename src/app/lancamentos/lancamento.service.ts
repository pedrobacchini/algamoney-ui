import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { Lancamento } from 'src/app/core/model';
import { environment } from '../../environments/environment';
import { MoneyHttp } from '../seguranca/money-http';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

  lancamentosUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.append('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
        console.log(filtro.dataVencimentoInicio);
    }

    if (filtro.dataVencimentoFim) {
      params = params.append('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
        console.log(filtro.dataVencimentoFim);
    }

    return this.http.get<any>(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
        const lancamentos = response.content;

        return {
          lancamentos,
          total: response.totalElements
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.lancamentosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
      .toPromise();
  }

  atualizar (lancamento: Lancamento): Promise<Lancamento> {
    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.id}`, lancamento)
          .toPromise()
          .then(response => {
            const lancamentoAlterado = response;

            this.converterStringParaDatas([lancamentoAlterado]);

            return lancamentoAlterado;
          });
  }

  buscarPorId(id: number): Promise<Lancamento> {
    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${id}`)
    .toPromise()
    .then(response => {
      const lancamento = response;

      this.converterStringParaDatas([lancamento]);

      return lancamento;
    });
  }

  private converterStringParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

        if (lancamento.dataPagamento) {
          lancamento.dataPagamento = moment(lancamento.dataPagamento,
            'YYYY-MM-DD').toDate();
        }
    }
  }
}
