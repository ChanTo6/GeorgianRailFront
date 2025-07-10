import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CustomAuthValidators } from '../validators/custom-auth.validators';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  pinSent = false;
  pin = '';
  pinError = '';
  pinSuccess = '';
  showPinInput = false;

  emailError = '';
  passwordError = '';

  constructor(private auth: AuthService, private router: Router) {}

  validateForm(): boolean {
    this.emailError = CustomAuthValidators.validateEmail(this.email) || '';
    this.passwordError = CustomAuthValidators.validatePassword(this.password) || '';
    return !this.emailError && !this.passwordError;
  }

  register() {
    this.error = '';
    this.success = '';
    if (!this.validateForm()) {
      return;
    }
    this.auth.register({ email: this.email, password: this.password })
      .subscribe({
        next: () => this.success = 'Registration successful!',
        error: err => this.error = err
      });
  }

  static routeToRegister(router: Router) {
    router.navigate(['/register']);
  }

 

  goTofirstpage() {
    this.router.navigate(['/firstpage']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  sendPin() {
    this.error = '';
    this.success = '';
    this.pinError = '';
    this.pinSuccess = '';
    if (!this.email) {
      this.error = 'Please enter your email first.';
      return;
    }
    this.auth.register({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.pinSent = true;
          this.success = 'PIN sent! Check your email.';
        },
        error: err => {
          this.error = err?.error?.detail || err?.error || 'Failed to send PIN.';
        }
      });
  }

  togglePinInput() {
    this.showPinInput = !this.showPinInput;
    this.pinError = '';
    this.pinSuccess = '';
  }

  validatePinFormat(pin: string): boolean {
    return /^\d{6}$/.test(pin);
  }

  validatePinInput(): boolean {
    this.pinError = '';
    if (!this.pin) {
      this.pinError = 'PIN is required.';
      return false;
    }
    if (!this.validatePinFormat(this.pin)) {
      this.pinError = 'PIN must be a 6-digit number.';
      return false;
    }
    return true;
  }

  verifyPin() {
    this.pinError = '';
    this.pinSuccess = '';
    if (!this.validatePinInput()) {
      return;
    }
    this.auth.verifyPin({ email: this.email, pin: this.pin }).subscribe({
      next: () => {
        this.pinSuccess = 'PIN verified! Registration complete.';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: err => {
        this.pinError = err?.error?.error || err?.error || 'Invalid PIN.';
      }
    });
  }
}
