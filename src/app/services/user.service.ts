import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class UserService {
  private userApi = 'https://localhost:7145/api/User';
  

  constructor(private http: HttpClient, private auth: AuthService) {}

 
    getProfile(): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.userApi}/profile`, { headers }).pipe(
      catchError((error) => {
        console.error('Profile fetch failed:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(data: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (!token) return throwError(() => new Error('No token found'));
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.userApi}/update`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 getTicketsByUserId(userId: number): Observable<any[]> {
  console.log(`Fetching tickets for user ID: ${userId}`);
  return this.http.get<any[]>(`${this.userApi}/sold-tickets/${userId}`).pipe(
    tap((response: any) => console.log('Tickets fetched:', response)),
    catchError(this.handleError)
  );
}


logTicketsByUserId(userId: number): void {
  this.getTicketsByUserId(userId).subscribe({
    next: (tickets) => {
      console.log('Received tickets:', tickets);
    },
    error: (err) => {
      console.error('Error fetching tickets:', err);
    }
  });
}


  private handleError(error: any) {
    let msg = 'An error occurred';
    if (error.error && error.error.title) {
      msg = error.error.title;
    }
    return throwError(() => msg);
  }
}