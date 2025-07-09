import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomAuthValidators } from '../validators/custom-auth.validators';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  email = '';
  password = '';
  error = '';
  success = '';
  emailError = '';
  passwordError = '';

  constructor(private auth: AuthService, private router: Router) {}

  validateForm(): boolean {
    this.emailError = CustomAuthValidators.validateEmail(this.email) || '';
    this.passwordError = CustomAuthValidators.validatePassword(this.password) || '';
    return !this.emailError && !this.passwordError;
  }

  login() {
    this.error = '';
    this.success = '';
    if (!this.validateForm()) {
      return;
    }
    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          if (res && res.token) {
            localStorage.setItem('jwt', res.token);
            this.success = 'Login successful!';
            // Fetch user data after successful login and set it globally
            this.auth.getUserData().subscribe({
              next: (userData) => {
                this.auth.userData = userData;
                console.log('User data:', userData);
                // Navigate to FirstComponent (home page)
                this.router.navigate(['/']);
              },
              error: (err) => {
                this.error = 'Failed to fetch user data: ' + err;
              }
            });
          } else {
            this.error = 'No token received from server.';
          }
        },
        error: err => this.error = err
      });
  }

  closeLogin() {
    this.router.navigate(['/']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  get isAdmin(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const token = localStorage.getItem('jwt');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'Admin';
    } catch {
      return false;
    }
  }
}
