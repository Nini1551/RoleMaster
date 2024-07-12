import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { User } from '../../../type';
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
  usernames: string[] = [];
  emails: string[] = [];
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  initializeForm(){
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, this.noWhitespaceAndLengthValidator.bind(this), this.uniqueUsernameValidator.bind(this)]],
      email: ['', [Validators.required, this.emailValidator.bind(this), this.uniqueEmailValidator.bind(this)]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator.bind(this)
    } as AbstractControlOptions);
  
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    console.log('Here');

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
        this.router.navigate(['/login']);

      },
      error: (error) => {
        console.error('Registration error', error);
      }
    });
  }

  noWhitespaceAndLengthValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      // Vérifie si la valeur contient des espaces
      const hasWhitespace = control.value.indexOf(' ') >= 0;
      // Vérifie si la longueur de la valeur est inférieure à 3 caractères
      const isTooShort = control.value.length < 3;
  
      if (hasWhitespace || isTooShort) {
        return { whitespaceOrMinLength: true };
      }
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
