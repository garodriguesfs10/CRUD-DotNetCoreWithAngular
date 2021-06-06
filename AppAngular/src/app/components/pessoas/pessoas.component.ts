import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Pessoa } from 'src/app/Pessoa';
import { PessoasService } from 'src/app/pessoas.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css'],
})
export class PessoasComponent implements OnInit {
  formulario: any;
  tituloFormulario?: string;
  pessoas!: Pessoa[];
  visibilidadeTabela: boolean = true;
  visibilidadeForm: boolean = false;
  modalRef!: BsModalRef;
  nomePessoa!: string;
  pessoaid!: number;
  constructor(
    private pessoasService: PessoasService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.pessoasService.PegarTodos().subscribe((resultado) => {
      this.pessoas = resultado;
    });
  }

  EnviarFormulario(): void {
    const pessoa: Pessoa = this.formulario.value;
    console.log(pessoa.id);
    if (pessoa.id > 0) {
      this.pessoasService.AtualizarPessoa(pessoa).subscribe((resultado) => {
        this.visibilidadeForm = false;
        this.visibilidadeTabela = true;
        alert('Pessoa atualizada com sucesso');
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    } else {
      this.pessoasService.SalvarPessoa(pessoa).subscribe((resultado) => {
        this.visibilidadeForm = false;
        this.visibilidadeTabela = true;
        alert('Pessoa inserida com sucesso');
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    }
  }

  ExcluirPessoa(pessoaId: any) {
    this.pessoasService.ExcluirPessoa(pessoaId).subscribe((resultado) => {
      this.modalRef.hide();
      alert('Pessoa excluida com sucesso!');
      this.pessoasService.PegarTodos().subscribe((registros) => {
        this.pessoas = registros;
      });
    });
  }

  ExibirConfirmacaoExclusao(
    pessoaid: any,
    nome: any,
    conteudoModal: TemplateRef<any>
  ): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.pessoaid = pessoaid;
    this.nomePessoa = nome;
  }
  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeForm = true;
    this.tituloFormulario = 'Novo Cadastro de pessoa';
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      sobrenome: new FormControl(null),
      idade: new FormControl(null),
      profissao: new FormControl(null),
    });
  }

  ExibirFormAtualizacao(pessoaId: any): void {
    this.visibilidadeTabela = false;
    this.visibilidadeForm = true;

    this.pessoasService.PegarPeloId(pessoaId).subscribe((resultado) => {
      if (resultado != null) {
        this.tituloFormulario = `Atualizar ${resultado.nome} - ${resultado.idade} anos`;
        this.formulario = new FormGroup({
          id: new FormControl(resultado.id),
          nome: new FormControl(resultado.nome),
          sobrenome: new FormControl(resultado.sobrenome),
          profissao: new FormControl(resultado.profissao),
          idade: new FormControl(resultado.idade),
        });
      } else {
        alert('Erro!');
      }
    });
  }

  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeForm = false;
  }
}
