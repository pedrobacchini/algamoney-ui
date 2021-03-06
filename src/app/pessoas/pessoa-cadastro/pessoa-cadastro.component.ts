import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import {ErrorHandlerService} from '../../core/error-handler.service';
import {PessoaService} from '../pessoa.service';
import {Cidade, Estado, Pessoa} from '../../core/model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();
  estados: Estado[];
  cidades: Cidade[];
  estadoSelecionado: Estado;

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {
  }

  ngOnInit() {
    this.title.setTitle('Nova pessoa');

    this.carregarEstados();

    const idPessoa = (this.route.snapshot.params['id']);

    if (idPessoa) {
      this.carregarPessoa(idPessoa);
    }
  }

  get editando() {
    return Boolean(this.pessoa.id);
  }

  carregarEstados() {
    this.pessoaService.listarEstados()
      .then(estados => this.estados = estados)
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado.id)
      .then(cidades => this.cidades = cidades)
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoa(id: number) {
    this.pessoaService.buscarPorId(id)
      .then(pessoa => {
        this.pessoa = pessoa;
        this.estadoSelecionado = (this.pessoa.endereco.cidade) ?
          this.pessoa.endereco.cidade.estado : null;
        if (this.estadoSelecionado) {
          this.carregarCidades();
        }
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa adicionada com sucesso!'
        });
        this.router.navigate(['/pessoas', pessoaAdicionada.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa atualizada com sucesso!'
        });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  nova(form: FormControl) {
    form.reset();

    setTimeout(function () {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['pessoas/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }
}
