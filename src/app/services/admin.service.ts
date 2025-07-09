import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private adminApi = 'https://localhost:7145/api/Admin';

  constructor(private http: HttpClient, private auth: AuthService) {}

  addTrain(data: { trainId: number; name: string; source: string; destination: string; date: string; time: string; totalSeats: number }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.adminApi}/add-train`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getSoldTickets(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.adminApi}/sold-tickets`, { headers }).pipe(
    tap((res:any) => {
      console.log('Sold tickets response:', res);
    }),
    catchError((error) => {
      console.error('Error in getSoldTickets():', error);
      return this.handleError(error);
    })
  );
}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private handleError(error: any) {
    let msg = 'An error occurred';
    if (error.error && error.error.title) {
      msg = error.error.title;
    }
    return throwError(() => msg);
  }
}
