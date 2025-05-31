import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  hasEmailError,
  isRequired,
  changeTheError$,
} from '../../utils/validators';
import { GoogleButtonComponent } from '../../registrars/google-button/google-button.component';
import { interval } from 'rxjs';

interface FormSignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export default class SignInComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  mtitle: string | undefined;
  color: string | undefined;

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }
  hasEmailError() {
    return hasEmailError(this.form);
  }
  form = this._formBuilder.group<FormSignIn>({
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
      this._authService.entrance({ email, password })
    );
    console.log('YSTM-INFO:', error?.message, user);
    if (error) {
      this.alreadyThere('АДРЕС НЕ НАЙДЕН…');
    } else {
      this._router.navigateByUrl('/entries');
    }
  }

  async submitWithGoogle() {
    try {
      await this._authService.entranceWithGoogle();
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      console.log('Ошибка входа…');
    }
  }
}
