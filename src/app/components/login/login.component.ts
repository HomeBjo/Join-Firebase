import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  rememberUser: boolean = false;

  constructor(public loginService: LoginService){}

  changeIcon(){
    this.rememberUser = !this.rememberUser;
  }

  googleLogin() {
    this.loginService.googleLogin();
  }
}
