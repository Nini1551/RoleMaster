import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../service/auth.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserProfile',
      'changePasswordRequest',
      'changeUsernameRequest',
      'changeEmailRequest'
    ]);

    
    authServiceSpy.getUserProfile.and.returnValue(of({ user: 'testuser', email: 'test@example.com' }));
    authServiceSpy.changePasswordRequest.and.returnValue(of({ successMessage: 'Password changed successfully', errorMessage: null }));
    authServiceSpy.changeUsernameRequest.and.returnValue(of({ successMessage: 'Username changed successfully', errorMessage: null }));
    authServiceSpy.changeEmailRequest.and.returnValue(of({ successMessage: 'Email changed successfully', errorMessage: null }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ProfileComponent],
      
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    fixture.detectChanges();

    expect(component.username).toBe('testuser');
    expect(component.email).toBe('test@example.com');
    expect(authService.getUserProfile).toHaveBeenCalled();

  });

  it('should set error message if loading user profile fails', () => {
    authService.getUserProfile.and.returnValue(throwError(() => new Error('Error fetching user profil')));

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Erreur lors de la récupération des informations utilisateurs.');
    expect(authService.getUserProfile).toHaveBeenCalled();
  });

  it('should enable edit mode for the username field', () => {
    expect(component.editMode['username']).toBeFalse();
  
    component.editField('username');
    expect(component.editMode['username']).toBeTrue();
  });

  it('should enable edit mode for email', () => {
    expect(component.editMode['email']).toBeFalse();
  
    component.editField('email');
    expect(component.editMode['email']).toBeTrue();
  });


  // OSEF je l'ai pas implémenté :DDD

  /**it('should enable edit mode for image', () => {
    expect(component.editMode['image']).toBeFalse();
  
    component.editField('image');
    expect(component.editMode['image']).toBeTrue();
  });**/

  it('should enable edit mode for password', () => {
    expect(component.editMode['password']).toBeFalse();
  
    component.editField('password');
    expect(component.editMode['password']).toBeTrue();
  });

  it('should cancel edit mode for username', () => {
    component.editMode['username'] = true;
  
    component.cancelEdit('username');
    expect(component.editMode['username']).toBeFalse();
  });

  it('should cancel edit mode for email', () => {
    component.editMode['email'] = true;
  
    component.cancelEdit('email');
    expect(component.editMode['email']).toBeFalse();
  });

  //Toujours pas non :DD

  /**it('should cancel edit mode for image', () => {
    component.editMode['image'] = true;
  
    component.cancelEdit('image');
    expect(component.editMode['image']).toBeFalse();
  }); **/
  it('should cancel edit mode for password and reset password messages', () => {
    // Activer le mode édition pour "password" et définir des messages d'erreur et de succès
    component.editMode['password'] = true;
    component.passwordErrorMessage = 'Some error';
    component.passwordSuccessMessage = 'Success';
    component.cancelEdit('password');

    expect(component.editMode['password']).toBeFalse();
    expect(component.passwordErrorMessage).toBeNull();
    expect(component.passwordSuccessMessage).toBeNull();
  });

  it('should change username successfully', () => {
    component.newUsername = 'newUser';
    component.changeUsername();
  
    expect(component.usernameSuccessMessage).toBe('Username changed successfully');
    expect(component.usernameErrorMessage).toBeNull();
    expect(authService.changeUsernameRequest).toHaveBeenCalledWith('newUser');
  });


  it('should handle error on username change', () => {
    const mockErrorResponse = { status: 400, error: {errorMessage: 'Ce username est déjà pris, veuillez en choisir un autre.'}};
    component.newUsername = 'newUser';
    authService.changeUsernameRequest.and.returnValue(throwError(() => mockErrorResponse));
    component.changeUsername();

    
    expect(component.usernameErrorMessage).toBe('Ce username est déjà pris, veuillez en choisir un autre.');
    expect(component.usernameSuccessMessage).toBeNull();
    expect(authService.changeUsernameRequest).toHaveBeenCalledWith('newUser');
  });

  it('should change email successfully', () => {
    component.newEmail = 'newemail@example.com';
    component.changeEmail();
  
    expect(component.emailSuccessMessage).toBe('Email changed successfully');
    expect(component.emailErrorMessage).toBeNull();
    expect(authService.changeEmailRequest).toHaveBeenCalledWith('newemail@example.com');
  });

  it('should handle error on email change', () => {
    const mockErrorResponse = { status: 400, error: {errorMessage: 'Cet email est déjà utilisé.'}};
    component.newEmail = 'newemail@example.com';
    authService.changeEmailRequest.and.returnValue(throwError(() => mockErrorResponse));
    component.changeEmail();
  
    expect(component.emailErrorMessage).toBe('Cet email est déjà utilisé.');
    expect(component.emailSuccessMessage).toBeNull();
    expect(authService.changeEmailRequest).toHaveBeenCalledWith('newemail@example.com');
  });

  it('should change password successfully', () => {
    component.oldPassword = 'oldPass123';
    component.newPassword = 'newPass123';
    component.confirmPassword = 'newPass123';
  
    component.changePassword();
  
    expect(component.passwordSuccessMessage).toBe('Password changed successfully');
    expect(component.passwordErrorMessage).toBeNull();
    expect(authService.changePasswordRequest).toHaveBeenCalledWith('oldPass123', 'newPass123');
  });


it('should handle error on password change', () => {
  const mockErrorResponse = { status: 400, error: {errorMessage: 'Le mot de passe actuel est incorrect'}};
  component.oldPassword = 'oldPass123';
  component.newPassword = 'newPass123';
  component.confirmPassword = 'newPass123';

  authService.changePasswordRequest.and.returnValue(throwError(() => mockErrorResponse));
  component.changePassword();

  expect(component.passwordErrorMessage).toBe('Erreur lors du changement de mot de passe.');
  expect(component.passwordSuccessMessage).toBeNull();
  expect(authService.changePasswordRequest).toHaveBeenCalledWith('oldPass123', 'newPass123');
});

it('should not change password if new passwords do not match', () => {
  component.oldPassword = 'oldPass123';
  component.newPassword = 'newPass123';
  component.confirmPassword = 'differentPass123';

  component.changePassword();

  expect(component.passwordErrorMessage).toBe('Les nouveaux mots de passe ne correspondent pas');
  expect(component.passwordSuccessMessage).toBeNull();
  expect(authService.changePasswordRequest).not.toHaveBeenCalled();
});

it('should display username edit form when edit mode is enabled', () => {
  component.editMode['username'] = true;
  fixture.detectChanges();

  const formEl = fixture.debugElement.query(By.css('form.change-form'));
  expect(formEl).toBeTruthy();
});

it('should not display username edit form when edit mode is disabled', () => {
  component.editMode['username'] = false;
  fixture.detectChanges();

  const form = fixture.debugElement.query(By.css('form.change-form'));
  expect(form).toBeFalsy();
});

it('should display email edit form when edit mode is enabled', () => {
  component.editMode['email'] = true;
  fixture.detectChanges();

  const form = fixture.debugElement.query(By.css('form.change-form'));
  expect(form).toBeTruthy();
});

it('should not display email edit form when edit mode is disabled', () => {
  component.editMode['email'] = false;
  fixture.detectChanges();

  const form = fixture.debugElement.query(By.css('form.change-form'));
  expect(form).toBeFalsy();
});

it('should display password edit form when edit mode is enabled', () => {
  component.editMode['password'] = true;
  fixture.detectChanges();

  const form = fixture.debugElement.query(By.css('form.change-form'));
  expect(form).toBeTruthy();
});

it('should not display password edit form when edit mode is disabled', () => {
  component.editMode['password'] = false;
  fixture.detectChanges();

  const form = fixture.debugElement.query(By.css('form.change-form'));
  expect(form).toBeFalsy();
});
  



});
