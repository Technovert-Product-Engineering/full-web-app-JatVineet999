// auth-service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/User';

  constructor(private apiService: ApiServiceService) { }

  login(credentials: User): Observable<string> {
    return this.apiService.post<string>(`${this.baseUrl}/login`, credentials, {
      responseType: 'text' as 'json'
    }).pipe(
      tap((token: string) => {
        sessionStorage.setItem('authToken', token);
      })
    );
  }

  signup(data: User): Observable<any> {
    return this.apiService.post<any>(`${this.baseUrl}/signup`, data);
  }

  logOut() {
    sessionStorage.removeItem('authToken');
  }


isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }
}
