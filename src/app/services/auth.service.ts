import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Console } from 'console';

@Injectable({ providedIn: 'root' })
export class AuthService {

  userData :any = null;

  getUserData(): Observable<any> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('No token found'));

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/me`, { headers }).pipe(
      tap(),
      catchError(this.handleError)
    );
  }
  private apiUrl = 'https://localhost:7145/api/Auth';

  constructor(private http: HttpClient) {}

  register(data: { email: string; password: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  login(data: { email: string; password: string }): Observable<any> {
        console.log(data.email, data.password)
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        console.log(res)
        if (res && res.token) {
          localStorage.setItem('jwt', res.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  verifyPin(data: { email: string; pin: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-pin`, data).pipe(
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  private handleError(error: any) {
    let msg = 'An error occurred';
    if (error.error && error.error.detail) {
      msg = error.error.detail;
    } else if (error.error && error.error.title) {
      msg = error.error.title;
    }
    return throwError(() => msg);
  }
}