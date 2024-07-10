import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { User } from '../../../type';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  usernames: string[] = [];
  emails: string[] = [];

  // Base de l'utilisateur, initialisé à des valeurs vides
  user: User = {
    username: '',
    email: '',
    password: ''
  };
  
  constructor(private formBuilder: FormBuilder, private auth: AuthService) { }
  
  ngOnInit() {
    this.auth.getUsers().subscribe(
      (data) => {
        this.usernames = data.map((user: any) => user.username);
        this.emails = data.map((user: any) => user.email);
      },
      (error) => {console.log(error)}
    );

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    console.log('Here');

    // Mise à jour des données de l'utilisateur
    this.user.username = this.registerForm.value.username;
    this.user.email = this.registerForm.value.email;
    this.user.password = this.registerForm.value.password;

    // Envoi des données de l'utilisateur au serveur
    this.auth.register(this.user).subscribe(
      (response: HttpResponse<any>) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.indexOf(' ') >= 0) {
      return { whitespace: true };
    }
    return null;
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { emailInvalid: true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (control.value && !passwordRegex.test(control.value)) {
      return { passwordInvalid: true };
    }
    return null;
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['mustMatch']) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  

}
