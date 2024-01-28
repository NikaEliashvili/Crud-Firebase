import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
import { confirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hasErrors: boolean | string = false;
  isLogging: boolean = false;
  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    {
      validators: confirmPasswordValidator,
    }
  );
  constructor(private auth: AuthService) {}
  submit() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    if (this.form.valid && email && password) {
      this.isLogging = true;
      this.auth
        .signUp(email, password)
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
}
