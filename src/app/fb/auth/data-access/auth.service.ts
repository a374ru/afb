import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})

//  Аутентификации в базе данных FireBase
export class AuthService {
  private _auth = inject(Auth);

  registration(user: User) {
    return createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );
  }

  entrance(user: User) {
    return signInWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );
  }

  entranceWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(
      this._auth,
      provider
    );
  }
}
