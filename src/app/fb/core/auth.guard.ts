import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../header/data-access/auth-state.service';
import { map } from 'rxjs';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthStateService);

    return authState.authState$.pipe(
      // TODO @a374ru @deprecated — Use a closure instead of a thisArg. Signatures accepting a thisArg will be removed in v8.
      map(state => {
        if (!state) {
          router.navigateByUrl('/auth/sign-in');
          
          return false;
        }

        return true;
      })
    );
  };
};

export const publicGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthStateService);

    return authState.authState$.pipe(
      map((state) => {
        if (state) {
          router.navigateByUrl('/entries');
          return false;
        }

        return true;
      })
    );
  };
};
