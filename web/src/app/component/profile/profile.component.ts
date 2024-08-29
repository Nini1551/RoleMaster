import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  implements OnInit {
 errorMessage: string | null = null;
 username: string | null = null;
 email: string | null = null;

 oldPassword: string | null = null ;
 newPassword: string | null = null ;
 confirmPassword: string | null = null;
 passwordErrorMessage: string | null = null;
 passwordSuccessMessage: string | null = null;


 newUsername: string | null = null;
 usernameErrorMessage: string | null = null;
 usernameSuccessMessage: string | null = null;

 newEmail: string | null = null;
 emailErrorMessage: string | null = null;
 emailSuccessMessage: string | null = null;


 editMode: { [key: string]: boolean } = {
  username: false,
  email: false,
  image: false,
  password: false
 };

 constructor(private authService: AuthService){}

 ngOnInit(): void {
  this.authService.getUserProfile().subscribe({
    next: (response) => {
      this.username = response.user;
      this.email = response.email;
     
    },
    error: (error) => {
      console.error('Error fetching user profile', error);
      this.errorMessage = 'Erreur lors de la récupération des informations utilisateurs.';
    }
  });
}

 editField(field: string): void {
  this.editMode[field] = true;
 }

 cancelEdit(field: string): void {
  this.editMode[field] = false,
  this.passwordErrorMessage = null;
  this.passwordSuccessMessage = null;
 }

 changePassword(): void {
  this.passwordErrorMessage = null;
  this.passwordSuccessMessage = null;

  if (this.newPassword !== this.confirmPassword) {
    this.passwordErrorMessage = 'Les nouveaux mots de passe ne correspondent pas';
    return;
  }

  this.authService.changePasswordRequest(this.oldPassword!, this.newPassword!).subscribe({
    next: (response) => {
      this.passwordSuccessMessage = response.successMessage;
      this.passwordErrorMessage = response.errorMessage;
      // this.editMode['password'] = false;
    },
    error: (error) => {
      console.error('Erreur lors du changement de mot de passe', error);
      this.passwordErrorMessage = 'Erreur lors du changement de mot de passe.';
    }
  });
 }

 changeUsername(): void {
  this.usernameErrorMessage = null;
  this.usernameSuccessMessage = null;

  this.authService.changeUsernameRequest(this.newUsername!).subscribe({
    next: (response) => {
      this.usernameSuccessMessage = response.successMessage;
      this.usernameErrorMessage = response.errorMessage;
    },
    error: (error) => {
      this.usernameErrorMessage = error.error.errorMessage;
    
    }
  });
 }

 changeEmail(): void {
  this.emailErrorMessage = null;
  this.emailSuccessMessage = null;
  
  this.authService.changeEmailRequest(this.newEmail!).subscribe({
    next: (response) => {
      this.emailSuccessMessage = response.successMessage;
      this.emailErrorMessage = response.errorMessage;
    },
    error: (error) => {
      this.emailErrorMessage = error.error.errorMessage;
    }
  });
 }
} 