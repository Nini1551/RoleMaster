import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../../type';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { passwordMatchValidator, passwordValidator } from '../../../validator/auth/password';
import { emailValidator, uniqueEmailValidator } from '../../../validator/auth/email';
import { minLengthValidator, noWhiteSpaceValidator, uniqueUsernameValidator } from '../../../validator/auth/username';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{
  registerForm!: FormGroup;
  submitted = false;
  usernames: string[] = []; // Tableau des noms d'utilisateurs
  emails: string[] = []; // Tableau des adresses e-mail
  private subscription!: Subscription;

  // Base de l'utilisateur, initialisé à des valeurs vides
  user: User = {  
    username: '',
    email: '',
    password: ''
  };
  
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
    this.initializeForm();
   }
  
  ngOnInit() {
  
  }

  ngOnDestroy() {
    
  }

  initializeForm(){
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        noWhiteSpaceValidator.bind(this),
        minLengthValidator.bind(this), 
        uniqueUsernameValidator(this.usernames).bind(this)
      ]],
      email: ['', [
        Validators.required, 
        emailValidator.bind(this), 
        uniqueEmailValidator(this.emails).bind(this)
      ]],
      password: ['', [
        Validators.required, 
        passwordValidator.bind(this)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: passwordMatchValidator.bind(this)
    } as AbstractControlOptions);
  }

  

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    // Mise à jour des données de l'utilisateur
    this.user = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    }

    // Envoi des données de l'utilisateur au serveur
    this.auth.signup(this.user).subscribe({
      next: (response: HttpResponse<any>) => {
        
        this.router.navigate(['/login']); // Redirige vers la page de connexion
      },
      error: (error) => {
        if (error.status === 409) {
          if (error.error.usernameTaken) {
            this.registerForm.get('username')?.setErrors({ usernameTaken: true});
          }
          if (error.error.emailTaken) {
            this.registerForm.get('email')?.setErrors({ emailTaken: true});
          }
        }
        if (error.status === 500) {
          alert('An error occurred. Please try again later.'); 
          this.router.navigate(['/register']);
        }
        else {
          console.error('Registration error', error);
        }
      }
    });
  }
}
