import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3000/auth'; // URL de votre backend
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/users`);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { email, password }).pipe(
      tap(response => {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('username', response.username);
        this.usernameSubject.next(response.username);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    this.usernameSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }
}

