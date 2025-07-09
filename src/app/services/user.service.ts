import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userApi = 'https://localhost:7145/api/User';
  

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get current user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.userApi}/me`).pipe(
      catchError(this.handleError)
    );
  }

  // Update user profile
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.userApi}/me`, data).pipe(
      catchError(this.handleError)
    );
  }


  // Get a ticket by its ID
  getTicketById(ticketId: number): Observable<any> {
  console.log(`Fetching ticket with ID: ${ticketId}`); // Log before the request
  return this.http.get(`${this.userApi}/sold-ticket/${ticketId}`).pipe(
    tap((response:any) => console.log('Ticket fetched:', response)), // Log the response
    catchError(this.handleError)
  );
}


  logTicketById(ticketId: number): void {
    this.getTicketById(ticketId).subscribe({
      next: (ticket) => {
        console.log('Received ticket:', ticket);
      },
      error: (err) => {
        console.error('Error fetching ticket:', err);
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
