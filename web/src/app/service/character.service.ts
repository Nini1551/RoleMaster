import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private baseUrl = 'http://localhost:3000/api/characters';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  create(name: string): Observable<any> {
    const character = { name };
    return this.http.post(`${this.baseUrl}/create`, character, { withCredentials: true });
  }

  getCharacters(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`, { withCredentials: true });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { withCredentials: true });
  }
}
