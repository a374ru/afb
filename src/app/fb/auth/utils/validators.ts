import { FormGroup } from '@angular/forms';

export const isRequired = (field: 'email' | 'password', form: FormGroup) => {
  const control = form.get(field);

  return control && control.touched && control.hasError('required');
};

export const hasEmailError = (form: FormGroup) => {
  const control = form.get('email');

  return control && control.touched && control.hasError('pattern');
}

export function changeTheError$<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => [error]);
}
