import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { emailValidator } from '../../../validator/auth/email';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator.bind(this)]],
      password: ['',[Validators.required]]
    });
  }
  get f() { return this.loginForm.controls;}

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const {email, password} = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
        /**this.authService.checkAuthStatus().subscribe({
          next: (response) => {
            this.router.navigate(['/home']);
          },
        }); **/
      },
      error: (error) => {
        this.submitted = false;
        console.error('Login error', error);

        if ((error.status === 401) || (error.status === 404)) {
          this.errorMessage = 'Adresse e-mail et/ou mot de passe incorrect(s). Veuillez réessayer.';
        }
      }
    });
    this.authService.checkAuthStatus().subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
    });
  }
}