import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.username$.subscribe(name => {
      this.username = name;
    });
  }

  get isAuthenticated(): boolean {
    const authStatus = this.authService.isAuthenticated();
    return authStatus
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);

  }
}
