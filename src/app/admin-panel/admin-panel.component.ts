

import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})


export class AdminPanelComponent implements OnInit {

  addUserForm: FormGroup;

  sectionMode: 'add' | 'update' | 'delete' | 'view' | null = null;
  selectedUser: any = null;

  toggleSection(section: 'add' | 'update' | 'delete' | 'view') {
    this.sectionMode = this.sectionMode === section ? null : section;
  }

  showAddUser = false;
  showUpdateUser: number | null = null;
  updateForm: FormGroup;

  message: string = '';
  users: any[] = [];
  selectedUserId: number | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
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
  addUser() {
    const { email, password, role } = this.addUserForm.value;
    if (!email || !password || !role) {
      this.message = 'Please fill in all fields to add a user.';
      return;
    }
    this.adminService.addUser({ email, password, role }).subscribe({
      next: () => {
        this.message = 'User added successfully!';
        this.fetchUsers();
        this.addUserForm.reset({ role: 'User' });
      },
      error: err => this.message = 'Add user failed: ' + err
    });
  }

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

