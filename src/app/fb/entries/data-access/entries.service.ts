import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../header/data-access/auth-state.service';

export interface Entry {
  id: string;
  content: string;
  marker: boolean;
}

export type EntryCreate = Omit<Entry, 'id'>;

// Название коллекции
const PATH = 'tst';

@Injectable()
export class EntryService {
  private _firestore = inject(Firestore);
  private _authState = inject(AuthStateService);

// путь к данным в коллекции
  private _collection = collection(this._firestore, PATH);
  private _query = query(
    this._collection,
    // Привязка данных к идентификатору пользователя. Если закомментировать данную строку, то будут вводиться все записи коллекции.
    where('userId', '==', this._authState.currentUser?.uid) 
  );

  loading = signal<boolean>(true);

  getEntries = toSignal(
    (collectionData(this._query, { idField: 'id' }) as Observable<Entry[]>).pipe(
      tap(() => {
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    {
      initialValue: [],
    }
  );

  constructor() {
    console.log(this._authState.currentUser);
  }

  getEntry(id: string) {
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(entry: EntryCreate) {
    return addDoc(this._collection, {
      ...entry,
      userId: this._authState.currentUser?.uid,
    });
  }

  update(task: EntryCreate, id: string) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, {
      ...task,
      userId: this._authState.currentUser?.uid,
    });
  }

  delete(id: string) {
    const docRef = doc(this._collection, id);
    return deleteDoc(docRef);
  }
}
