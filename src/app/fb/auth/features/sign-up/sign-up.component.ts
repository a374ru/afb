import { Component, inject } from '@angular/core';
import { interval, range } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { hasEmailError, isRequired, changeTheError$ } from '../../utils/validators';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { GoogleButtonComponent } from '../../registrars/google-button/google-button.component';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './sign-up.component.html',
})
export default class SignUpComponent {
  mtitle: string | undefined
  color: string | undefined;
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }
  hasEmailError() {
    return hasEmailError(this.form);
  }

  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    ]),
    password: this._formBuilder.control('', Validators.required),
  });


  alreadyThere(notification: string): void {
    let danger = interval(300).subscribe((val) => {
      if (val < 12) {
        this.mtitle = notification;
        this.color = 'red';
      } else {
        this.color = 'gray';
        this.mtitle = '';

        danger.unsubscribe();
      }
    });
  }


  async submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    if (!email || !password) return;
    const [error, user] = await changeTheError$(
      this._authService.registration({ email, password })
    );
    console.log('YSTM-INFO:', error?.message, user);
    if (error) {
      this.alreadyThere('Адрес уже зарегистрирован…');
    } else {
      this._router.navigateByUrl('/entries');
    }
  }

  async submitWithGoogle() {
    try {
      await this._authService.entranceWithGoogle();
      console.log('Добро пожаловать!');
      this._router.navigateByUrl('/entries');
    } catch (error) {
      console.log('Ошибка входа…', error);
    }
  }
}
