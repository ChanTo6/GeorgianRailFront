import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  trainId: number | null = null;
  name = '';
  source = '';
  destination = '';
  date = '';
  time = '';
  totalSeats: number | null = null;
  adminSuccess = '';
  adminError = '';
  soldTickets: any[] = [];

  constructor(private adminService: AdminService) {}

  addTrain() {
    this.adminSuccess = '';
    this.adminError = '';
    if (this.trainId && this.name && this.source && this.destination && this.date && this.time && this.totalSeats) {
      this.adminService.addTrain({
        trainId: this.trainId,
        name: this.name,
        source: this.source,
        destination: this.destination,
        date: this.date,
        time: this.time,
        totalSeats: this.totalSeats
      }).subscribe({
        next: () => this.adminSuccess = 'Train added!',
        error: err => this.adminError = err
      });
    } else {
      this.adminError = 'All fields are required.';
    }
  }

  getSoldTickets() {
    this.adminService.getSoldTickets().subscribe({
      next: (res) => this.soldTickets = res,
      error: err => this.adminError = err
    });
  }
}
