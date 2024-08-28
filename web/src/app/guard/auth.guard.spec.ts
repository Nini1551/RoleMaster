import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { isObservable, of, throwError } from 'rxjs';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService, useValue : { checkAuthStatus: jasmine.createSpy('checkAuthStatus')}
        },
        {
          provide: Router, useValue: { navigate: jasmine.createSpy('navigate')}
        }
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

 


  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation when user is authenticated', (done) => {
    // Simuler un utilisateur authentifié
    (authService.checkAuthStatus as jasmine.Spy).and.returnValue(of({ authenticated: true }));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);

      if (isObservable(result)) {
        result.subscribe(isAllowed => {
          expect(isAllowed).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else if (result instanceof Promise) {
        result.then(isAllowed => {
          expect(isAllowed).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should deny activation and redirect to login when user is not authenticated', (done) => {
    (authService.checkAuthStatus as jasmine.Spy).and.returnValue(of({ authenticated: false }));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);

      if (isObservable(result)) {
        result.subscribe(isAllowed => {
          expect(isAllowed).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else if (result instanceof Promise) {
        result.then(isAllowed => {
          expect(isAllowed).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });
  });

  it('should deny activation and redirect to login when an error occurs', (done) => {
    (authService.checkAuthStatus as jasmine.Spy).and.returnValue(throwError(() => new Error('Test error')));

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);

      if (isObservable(result)) {
        result.subscribe(isAllowed => {
          expect(isAllowed).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else if (result instanceof Promise) {
        result.then(isAllowed => {
          expect(isAllowed).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });
  });

 

});
