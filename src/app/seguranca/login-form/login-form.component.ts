import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  defaultEmail = 'admin@algamoney.com';

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
  }

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha)
      .catch(error => {
        this.errorHandler.handle(error);
      });
  }
}
