import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username: string | null = null;
  isAuthenticated: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
     this.authService.checkAuthStatus().subscribe();
     /**  next: (response) => {
        this.isAuthenticated = response.authenticated;
        console.log(this.isAuthenticated);
        if (this.isAuthenticated) {
          // Si authentifié, récupérer le nom d'utilisateur
          this.authService.getUserName$().subscribe((username) => {
            this.username = username;
          });
        } else {
          this.username = null;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
      }
    }); **/

    this.authService.isAuthenticated$().pipe(
      takeUntil(this.destroy$)).subscribe(authStatus => {
        this.isAuthenticated = authStatus;
      });

    this.authService.getUserName$().pipe(
      takeUntil(this.destroy$)).subscribe(username => {
        this.username = username;
      });
    
  }

    
        


  logout(): void {
    console.log('hello');
    this.authService.checkAuthStatus().subscribe({
      next: (response) => {
        if (response) {
          this.authService.logout().subscribe({
            next: (response) => {
              this.isAuthenticated = false;
              this.username = null;
              this.router.navigate(['/login']);
            }
          });
       }
      }
    });
  }
}
