import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { AuthGuard } from '../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'lancamentos',
    component: LancamentosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_PESQUISAR_LANCAMENTO' }
  },
  {
    path: 'lancamentos/novo',
    component: LancamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_CADASTRAR_LANCAMENTO' }
  },
  {
    path: 'lancamentos/:id',
    component: LancamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_CADASTRAR_LANCAMENTO' }
  }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }
