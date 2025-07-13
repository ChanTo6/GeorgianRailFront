

import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CustomAuthValidators } from '../validators/custom-auth.validators';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})


export class AdminPanelComponent implements OnInit {

  addUserForm: FormGroup;

  sectionMode: 'add' | 'update' | 'delete' | 'view' | null = null;
  selectedUser: any = null;
  pinError!: any;
  pinSuccess!: any;
  success!: string;
  error!: string;
  email!: string;
  password!: string;
  

  toggleSection(section: 'add' | 'update' | 'delete' | 'view') {
    this.sectionMode = this.sectionMode === section ? null : section;
  }

  showAddUser = false;
  showUpdateUser: number | null = null;
  updateForm: FormGroup;

  message: string = '';
  users: any[] = [];
  selectedUserId: number | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService, private auth: AuthService, private router: Router) {
    this.updateForm = this.fb.group({
      email: [''],   
      role: ['']
    });
    this.addUserForm = this.fb.group({
      email: [''],
      password: [''],
      role: ['User']
    });
  }
  // --- Two-step Admin Registration ---
  pinSent = false;
  pin = '';
  showPinInput = false;

  emailError = '';
  passwordError = '';

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
      this.sectionMode = null;

      setTimeout(() => {
        this.sectionMode = null;
      }, 1500); // Correct syntax here
    },
    error: err => {
      this.pinError = err?.error?.error || err?.error || 'Invalid PIN.';
    }
  });
}

  
  // Registration is handled by verifyPinAndRegister


  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.message = 'User deleted successfully!';
        this.fetchUsers();
      },
      error: err => this.message = 'Delete user failed: ' + err
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
  this.adminService.getAllUsers().subscribe({
    next: (res) => {
      console.log('Fetched users:', res);
      this.users = res;
    },
    error: (err) => {
      console.error('Failed to fetch users:', err);
      this.message = 'Failed to fetch users: ' + err;
    }
  });
}


  onUserSelect(event: any) {
    this.selectedUserId = +event.target.value;
    this.selectedUser = this.users.find(u => u.id === this.selectedUserId) || null;
    if (this.selectedUser) {
      this.updateForm.patchValue({
        email: this.selectedUser.email || '',
        role: this.selectedUser.role || ''
      });
    } else {
      this.updateForm.reset();
    }
    console.log('Selected user:', this.selectedUser);
  }

  onSubmit() {
    const id = this.selectedUserId;
    if (!id) {
      this.message = 'Please select a user.';
      return;
    }

    const selectedUser = this.users.find(u => u.id === id);
    if (!selectedUser) {
      this.message = 'Selected user not found.';
      return;
    }

    console.log('Selected user:', selectedUser);

    const { email, role } = this.updateForm.value;
    const data: any = {
      id: id,
      email: email,
      role: role
    };

    console.log('Updating user:', data);

    this.adminService.updateUser(id, data).subscribe({
      next: () => {
        this.message = 'User updated successfully!';
        this.fetchUsers();
        this.updateForm.reset();
        this.selectedUserId = null;
      },
      error: err => this.message = 'Update failed: ' + err
    });
  }

  
  }
