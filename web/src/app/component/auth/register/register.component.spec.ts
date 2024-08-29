import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../service/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';


// mocking du AuthService avec les requêtes AuthService utilisées par Register => return of ({object})
class AuthServiceMock {
  signup(user:any) {
    return of ({})
  };
}

// mocking du service de routing => appel d'un Path
class RouterMock {
  navigate(path: string[]) {}
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthServiceMock;
  let router: RouterMock;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RegisterComponent, ReactiveFormsModule, RouterModule],
      providers: [
        HttpClient, 
        HttpHandler, 
        provideHttpClientTesting(),
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useClass: RouterMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

      // 1 : TESTs D'INITIALISATION
  it('should create component', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize register form', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.controls['username']).toBeDefined();
    expect(component.registerForm.controls['email']).toBeDefined();
    expect(component.registerForm.controls['password']).toBeDefined();
    expect(component.registerForm.controls['confirmPassword']).toBeDefined();
  });

      // 2 : TESTs de validation des champs du formulaire
  it('should make username,email,password and confirmpassword fields => required', () => {
    const usernameControl = component.registerForm.controls['username'];
    const emailControl = component.registerForm.controls['email'];
    const passwordControl = component.registerForm.controls['password'];
    const confirmPasswordControl = component.registerForm.controls['confirmPassword'];

    usernameControl.setValue('');
    emailControl.setValue('');
    passwordControl.setValue('');
    confirmPasswordControl.setValue('');

    expect(usernameControl.invalid).toBeTrue();
    expect(emailControl.invalid).toBeTrue();
    expect(passwordControl.invalid).toBeTrue();
    expect(confirmPasswordControl.invalid).toBeTrue();
  });

      // 2.1 Username
  it('should validate that username has no whitespace', () => {
    const usernameControl = component.registerForm.controls['username'];
    usernameControl.setValue('user name');

    expect(usernameControl.errors?.['hasWhiteSpace']).toBeTrue();
  });

      // 2.2 Email
  it('should validate that email format is correct', () => {
    const emailControl = component.registerForm.controls['email'];

    emailControl.setValue('email.test.gmail.com');
    expect(emailControl.errors?.['emailInvalid']).toBeTrue();

    emailControl.setValue('email@gmail.');
    expect(emailControl.errors?.['emailInvalid']).toBeTrue();

    emailControl.setValue('email@gmail.c');
    expect(emailControl.errors?.['emailInvalid']).toBeTrue();

    emailControl.setValue('@gmail.com');
    expect(emailControl.errors?.['emailInvalid']).toBeTrue();
  })

    // 2.3 Password

  it('should validate that password format is correct', () => {
    const passwordControl = component.registerForm.controls['password'];
    // 2.3.1 Too short with maj letter nbr and special carac
    passwordControl.setValue('Short1!');
    expect(passwordControl.errors?.['passwordInvalid']).toBeTrue();

    // 2.3.2 Not [short/caract/nbr] but has no Maj

    passwordControl.setValue('not to short but no maj 1');
    expect(passwordControl.errors?.['passwordInvalid']).toBeTrue();

    // 2.3.3 Not [short/Maj/caract] but has no number

    passwordControl.setValue('noShort!ButNoNumber');
    expect(passwordControl.errors?.['passwordInvalid']).toBeTrue();

    // 2.3.4 Not [short/nbr/Maj] but has no special carac

    passwordControl.setValue('NoShortHasMajHasN0mber');
    expect(passwordControl.errors?.['passwordInvalid']).toBeTrue();
  });
    // 2.4 Matching password
  it('should validate that passwords match', () => {
    const passwordControl = component.registerForm.controls['password'];
    const confirmPasswordControl = component.registerForm.controls['confirmPassword'];
    
    passwordControl.setValue('Password123!');
    confirmPasswordControl.setValue('Password123');
    
    expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
  });


  //  3 : Test de soumission valide du form
  it('should submit the form if valid and navigate to login', () => {
    spyOn(authService, 'signup').and.callThrough();
    spyOn(router, 'navigate').and.stub();

  
    component.registerForm.controls['username'].setValue('validUsername');
    component.registerForm.controls['email'].setValue('validemail@example.com');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');
  
    component.onSubmit();

    expect(component.user.email).toEqual('validemail@example.com');
    expect(component.user.username).toEqual('validUsername');
    expect(component.user.password).toEqual('Password123!');

    expect(authService.signup).toHaveBeenCalled();

    expect(authService.signup).toHaveBeenCalledWith(component.user);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // 4: Test de soumission invalide du form
  it('should not submit the form if invalid', () => {
    spyOn(authService, 'signup').and.callThrough();
  
    component.onSubmit();
  
    expect(component.registerForm.invalid).toBeTrue();
    expect(authService.signup).not.toHaveBeenCalled();
  });

  // 5: Test gestion des erreurs api

  it('should set errors if username or email is taken', () => {
    spyOn(authService, 'signup').and.returnValue(throwError(() => ({
      status: 409,
      error: { usernameTaken: true, emailTaken: true }
    })));
  
    component.registerForm.controls['username'].setValue('existingUsername');
    component.registerForm.controls['email'].setValue('existingemail@example.com');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');
  
    component.onSubmit();
  
    expect(component.registerForm.controls['username'].errors?.['usernameTaken']).toBeTrue();
    expect(component.registerForm.controls['email'].errors?.['emailTaken']).toBeTrue();
  });

  it('should alert and navigate to register if server error occurs', () => {
    spyOn(window, 'alert');
    spyOn(authService, 'signup').and.returnValue(throwError(() => ({ status: 500 })));
    spyOn(router, 'navigate').and.stub();
  
    component.registerForm.controls['username'].setValue('validUsername');
    component.registerForm.controls['email'].setValue('validemail@example.com');
    component.registerForm.controls['password'].setValue('Password123!');
    component.registerForm.controls['confirmPassword'].setValue('Password123!');
  
    component.onSubmit();
  
    expect(window.alert).toHaveBeenCalledWith('An error occurred. Please try again later.');
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  // 6: Test de l'état submitted du form
  it('should set submitted to true on form submission', () => {
    component.onSubmit();
  
    expect(component.submitted).toBeTrue();
  });
});
