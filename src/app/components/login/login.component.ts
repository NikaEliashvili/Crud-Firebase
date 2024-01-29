import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hasErrors: boolean | string = false;
  isLogging: boolean = false;
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(private auth: AuthService) {}
  submit() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    if (this.form.valid && email && password) {
      this.isLogging = true;
      this.auth
        .logIn(email, password)
        .then(() => {})
        .catch((error) => {
          this.hasErrors = error.code.replace('auth/', '').replaceAll('-', ' ');
          if (this.hasErrors === 'invalid credential') {
            this.hasErrors = 'Email or password is incorrect';
          }
        })
        .finally(() => {
          this.isLogging = false;
          setTimeout(() => {
            this.hasErrors = false;
          }, 3000);
        });
    }
  }

  signInWithGoogle() {
    this.auth
      .googleSignIn()
      .then((res) => {})
      .catch((error) => {
        console.log(error);
        this.hasErrors = error.code.replace('auth/', '').replaceAll('-', ' ');
        if (this.hasErrors === 'invalid credential') {
          this.hasErrors = 'Email or password is incorrect';
        }
      });
  }
}
