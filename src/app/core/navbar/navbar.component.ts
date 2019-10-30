import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../seguranca/auth.service';
import {LogoutService} from '../../seguranca/logout.service';
import {ErrorHandlerService} from '../error-handler.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  constructor(private auth: AuthService,
              private logoutService: LogoutService,
              private errorHandler: ErrorHandlerService,
              private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => this.errorHandler.handle(error));
  }

}
