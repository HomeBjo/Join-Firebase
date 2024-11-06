import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  acceptPolicy = false;

  nameInvalid = false;
  emailInvalid = false;
  password1Invalid = false;
  password2Invalid = false;
  passwordMismatch = false;

  constructor(public loginService: LoginService) {}

  changeIcon() {
    this.acceptPolicy = !this.acceptPolicy;
  }

  checkNameValue() {
    this.nameInvalid = this.loginService.name.length < 3;
  }

  checkMailValue() {
    this.emailInvalid = !this.checkIfUserEmailIsValid();
  }

  checkPassword1Value() {
    this.password1Invalid = this.loginService.password1.length < 6;
  }

  checkPassword2Value() {
    this.password2Invalid = this.loginService.password2.length < 6;
  }

  chackEqualPassword() {
    this.passwordMismatch = !(this.loginService.password1 === this.loginService.password2);
  }

  checkIfUserEmailIsValid() {
    if (this.loginService.email.trim() === '') {
      return false;
    } else {
      const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(this.loginService.email);
    }
  }

  disabledBtn(){
    if ( !this.nameInvalid && !this.emailInvalid && !this.passwordMismatch && this.acceptPolicy) {
      this.loginService.loginBoolean = true;
      return true;
    } else {
      this.loginService.loginBoolean = false;
      return false;
    }
  }
}
