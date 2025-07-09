import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TrainService {
  private userApi = 'https://localhost:7145/api/User';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllTrains(): Observable<any> {
    return this.http.get(`${this.userApi}/all-trains`).pipe(
      catchError(this.handleError)
    );
  }

  searchTrains(source: string, destination: string): Observable<any> {
    const params = new HttpParams().set('source', source).set('destination', destination);
    return this.http.get(`${this.userApi}/search-trains`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  buyTickets(data: { userId: number; tickets: { trainId: number; seatNumber: number }[] }): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(data.userId, data.tickets);
    return this.http.post(`${this.userApi}/buy`, data, { headers }).pipe(
      catchError(this.handleError)
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
