import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../service/auth.service';
import { LoginComponent } from './login.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


class AuthServiceMock {
  login(email: string, password: string) {
    return of({}); // Simule une réponse positive
  }
  checkAuthStatus() {
    return of({}); // Simule une vérification d'authentification réussie
  }
}

class RouterMock {
  navigate(path: string[]) { }
}


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthServiceMock;
  let router: RouterMock;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, ReactiveFormsModule],
      providers: [
        HttpClient,
        HttpHandler,
        provideHttpClientTesting(),
        {provide: AuthService, useClass: AuthServiceMock},
        {provide: Router, useClass: RouterMock}]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });


  it('should make email and password fields required', () => {
    const emailControl = component.loginForm.controls['email'];
    const passwordControl = component.loginForm.controls['password'];
    
    emailControl.setValue('');
    passwordControl.setValue('');

    expect(emailControl.invalid).toBeTrue();
    expect(passwordControl.invalid).toBeTrue();
  });


  it('should validate email format', () => {
    const emailControl= component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');

    expect(emailControl.invalid).toBeTrue();
    expect(emailControl.errors?.['emailInvalid']).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    spyOn(authService, 'login').and.callThrough();
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should submit if form is valid', () => {
    spyOn(authService, 'login').and.callThrough();
    spyOn(authService, 'checkAuthStatus').and.callThrough();

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    
  });

  it('should set submitted to true when form is submitted', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();
  
    expect(component.submitted).toBeTrue();
  });

  it ('should call checkAuthStatus if form is called and valid', () => {
    spyOn(authService, 'login').and.returnValue(of({authenticated: true}));
    spyOn(authService, 'checkAuthStatus').and.callThrough();

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();
    expect(authService.checkAuthStatus).toHaveBeenCalled();
  });

  it ('should redirect to /home if login form is called and correct then chekcAuthStatus is called and correct', () => {
    spyOn(authService, 'login').and.returnValue(of({authenticated: true}));
    spyOn(authService, 'checkAuthStatus').and.returnValue(of({authenticated: true}));
    spyOn(router, 'navigate').and.stub();

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');

    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  })

  it('should display error message on Login Failure', () => {
    spyOn(authService, 'login').and.returnValue(throwError(() => ({status: 401})));
    spyOn(router, 'navigate').and.stub();
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();

    expect(component.errorMessage).toBe('Adresse e-mail et/ou mot de passe incorrect(s). Veuillez réessayer.');
    expect(component.submitted).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();


  });

  it('should not submit if the form is empty and show validation errors', () => {

    component.onSubmit();

    expect(component.loginForm.invalid).toBeTrue();
    expect(component.submitted).toBeTrue();
    expect(component.f['email'].errors).toBeTruthy();
    expect(component.f['password'].errors).toBeTruthy();
  });

  it('should call checkAuthStatus after login and handle error on first attempt', () => {
    spyOn(authService, 'login').and.returnValues(
      throwError(() => ({status: 401})), 
      of({ authenticated: true })  
    );
    spyOn(authService, 'checkAuthStatus').and.returnValue(of({authenticated: true}));
    spyOn(router, 'navigate').and.stub();
  
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
  
    // premier appel 
    component.onSubmit();
    expect(authService.checkAuthStatus).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Adresse e-mail et/ou mot de passe incorrect(s). Veuillez réessayer.');
  
    // duexème appel
    component.onSubmit();
    expect(authService.checkAuthStatus).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  
});
