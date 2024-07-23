import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../../type';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    this.setUsersData();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initializeForm(){
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        this.noWhiteSpaceValidator.bind(this),
        this.minLengthValidator.bind(this), 
        this.uniqueUsernameValidator.bind(this)
      ]],
      email: ['', [
        Validators.required, 
        this.emailValidator.bind(this), 
        this.uniqueEmailValidator.bind(this)
      ]],
      password: ['', [
        Validators.required, 
        this.passwordValidator.bind(this)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator.bind(this)
    } as AbstractControlOptions);
  }

  setUsersData() { // Récupère les données des utilisateurs à l'initialisation de la page
    this.subscription = this.auth.getUsers().subscribe({
      next: (data) => {
        this.usernames = data.map((user: any) => user.username);
        this.emails = data.map((user: any) => user.email);
      },
      error: (err) => {
        console.error('Error fetching users', err);
      },
      complete: () => {
        console.log('User data fetch complete');
      }
    });
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
    this.auth.register(this.user).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Redirige vers la page de connexion
      },
      error: (error) => {
        if (error.status === 500) {
          alert('An error occurred. Please try again later.'); // En cas d'erreur d'enregistrement, une alerte est lancée
          this.router.navigate(['/register']); // Redirige ensuite vers la page d'enregistrement
        }
        else {
          console.error('Registration error', error);
        }
      }
    });
  }

  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null { // Vérifie si la valeur contient des espaces
    if (control.value && control.value.indexOf(' ') >= 0) {
      return { hasWhiteSpace: true };
    }
    return null;
  }

  minLengthValidator(control: AbstractControl): ValidationErrors | null { // Vérifie si la longueur de la valeur est inférieure à 3 caractères
    const MIN_LENGTH = 3;
    if (control.value && control.value.length < MIN_LENGTH) {
      return { isTooShort: true };
    }
    return null;
  }

  uniqueUsernameValidator(control: AbstractControl): ValidationErrors | null {
    const username = control.value;
    const isUnique = this.usernames.indexOf(username) === -1;
    return isUnique ? null : { 'usernameTaken': true };
  }
  

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { emailInvalid: true };
    }
    return null;
  } 

  uniqueEmailValidator(control: AbstractControl) : ValidationErrors | null {
    const email = control.value
    const isUnique = this.emails.indexOf(email) === -1;
    return isUnique ? null : { 'emailTaken': true };
  }


  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 8;
    const hasUpperCase = value.split('').some((char : string) => char >= 'A' && char <= 'Z');
    const hasLowerCase = value.split('').some((char : string) => char >= 'a' && char <= 'z');
    const hasNumeric = value.split('').some((char : string) => char >= '0' && char <= '9');
    const hasSpecial = value.split('').some((char : string) => '!@#$%^&*(),.?":{}|<>'.includes(char));

    const passwordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return !passwordValid ? { 'passwordInvalid': true } : null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }


}
