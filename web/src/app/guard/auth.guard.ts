import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    map(response => {
      if (response.authenticated) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
