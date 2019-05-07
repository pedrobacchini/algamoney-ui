import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import {AuthGuard} from '../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'pessoas',
    component: PessoasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_PESQUISAR_PESSOA' }
  },
  {
    path: 'pessoas/nova',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_CADASTRAR_PESSOA' }
  },
  {
    path: 'pessoas/:id',
    component: PessoaCadastroComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_CADASTRAR_PESSOA' }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PessoasRoutingModule { }
