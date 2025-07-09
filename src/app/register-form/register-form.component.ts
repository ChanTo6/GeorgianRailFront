import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';
    this.auth.register({ email: this.email, password: this.password})
      .subscribe({
        next: () => this.success = 'Registration successful!',
        error: err => this.error = err
      });
  }

  // Call this from any button to route to this component
  static routeToRegister(router: Router) {
    router.navigate(['/register']);
  }

  // Or, for use in a template:
  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
