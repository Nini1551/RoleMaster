import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/users';
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  



  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  login(email: string, password: string): Observable<any> {
    const user = { email, password }
    return this.http.post(`${this.baseUrl}/login`, user, { withCredentials: true}).pipe(
      tap((response: any) => {
        console.log(response)
        if (response.authenticated) {
          console.log(response.authenticated);
          this.authenticatedSubject.next(true);
          this.usernameSubject.next(response.username);
        }
      })
    )
  }

  logout(): Observable<any> {
    // Retourner le résultat de la requête HTTP POST à la route /logout
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true })// Met à jour l'état d'authentification après la déconnexion
    }
  


  checkAuthStatus(): Observable<any> {
      return this.http.get(`${this.baseUrl}/check-auth`, { withCredentials: true }).pipe(
        tap((response: any) => {
          if (response.authenticated) {
            console.log(response)
            this.authenticatedSubject.next(true);
            this.usernameSubject.next(response.user);
          }
        })
      )
      }
  

  isAuthenticated$(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
    }

  getUserName$(): Observable<any> {
    return this.usernameSubject.asObservable();
  }
  
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/userProfile`, { withCredentials: true});
  }
  
  changePasswordRequest(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/changePassword`, {oldPassword, newPassword},{ withCredentials: true});
  }

  changeUsernameRequest(newUsername: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/changeUsername`, {newUsername}, {withCredentials: true});
  }

  changeEmailRequest(newEmail: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/changeEmail`, {newEmail}, {withCredentials: true});
  }

}