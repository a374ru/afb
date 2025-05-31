import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from "../environments/environment"
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        // Этот объект используется для подключения к нужной базе данных.
        // Замените текущие данные на свои. Данные можно получить на хостинге сервиса FireBase.
        apiKey: 'AIzaSyBXZ7XPF40h4ZDQQB1xrkKHhBv4yBT3F4U',
        authDomain: 'a374ru-e0bb4.firebaseapp.com',
        databaseURL:
          'https://a374ru-e0bb4-default-rtdb.europe-west1.firebasedatabase.app',
        projectId: 'a374ru-e0bb4',
        storageBucket: 'a374ru-e0bb4.appspot.com',
        messagingSenderId: '896320504144',
        appId: '1:896320504144:web:551ea096e6a170b09b2c55',
      })
    ),
    /**
        * Функция переопределяет запрос зависимости от режима разработки.
        * При подключенном эмуляторе будет использоваться всегда локальный эмулятор FireBase для сохранения, чтения и редактирование записей.
        * 
        */
    provideAuth(() => {
      let auth = getAuth()
      if (!environment.production) {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: false })
        return auth
      }
      return auth
    }),

    /**
    * Функция переопределяет запрос зависимости от режима разработки.
    * При подключенном эмуляторе будет использоваться всегда локальный эмулятор FireBase для аутентификации пользователя.
    * 
    */
    provideFirestore(() => {
      let firestore: Firestore = getFirestore()
      if (!environment.production) {
        connectFirestoreEmulator(firestore, 'localhost', 8080)
        return firestore
      } else {
        return firestore
      }
    }
    ),
  ],
};
