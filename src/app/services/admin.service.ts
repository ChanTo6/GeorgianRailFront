import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable({ providedIn: 'root' })
export class AdminService {
  // --- Admin Registration: Send PIN to Email ---
  sendRegistrationPin(email: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.adminApi}/send-registration-pin`, { email }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // --- Admin Registration: Verify PIN ---
  verifyRegistrationPin(email: string, pin: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.adminApi}/verify-registration-pin`, { email, pin }, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  private adminApi = 'https://localhost:7145/api/Admin';

  constructor(private http: HttpClient, private auth: AuthService) {}

  addTrain(data: { trainId: number; name: string; source: string; destination: string; date: string; time: string; totalSeats: number }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.adminApi}/add-train`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addUser(data: { email: string; password: string; role: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.adminApi}/add-user`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, data: { email?: string; password?: string; role?: string }): Observable<any> {

    console.log(id, data);
    const headers = this.getAuthHeaders();

    const filteredData: any = {};
    if (data.email) filteredData.email = data.email;
    if (data.password) filteredData.password = data.password;
    if (data.role) filteredData.role = data.role;
    if (Object.keys(filteredData).length === 0) {
      return throwError(() => 'No fields to update.');
    }
    return this.http.put(`${this.adminApi}/update-user/${id}`, filteredData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.adminApi}/delete-user/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.adminApi}/all-users`, { headers }).pipe(
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
