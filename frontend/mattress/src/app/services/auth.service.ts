import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/'; // Replace with your backend URL

  private authState = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/signup`, userData).pipe(
      catchError((error) => {
        console.error('Signup failed', error);
        return throwError(() => new Error(error.message || 'Signup error'));
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}auth/login`, credentials).pipe(
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => new Error(error.message || 'Login error'));
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
    this.authState.next(true); // Update authentication state
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      return payload.userId; // Ensure your JWT includes `userId`
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  logout() {
    localStorage.removeItem('authToken');
    this.authState.next(false); // Update authentication state
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
