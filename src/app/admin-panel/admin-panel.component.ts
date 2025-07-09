import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { CustomTrainValidators } from '../validators/custom-train.validators';

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

  trainIdError = '';
  nameError = '';
  sourceError = '';
  destinationError = '';
  dateError = '';
  timeError = '';
  totalSeatsError = '';

  constructor(private adminService: AdminService) {}

  validateForm(): boolean {
    this.trainIdError = CustomTrainValidators.validateTrainId(this.trainId) || '';
    this.nameError = CustomTrainValidators.validateName(this.name) || '';
    this.sourceError = CustomTrainValidators.validateSource(this.source) || '';
    this.destinationError = CustomTrainValidators.validateDestination(this.destination) || '';
    this.dateError = CustomTrainValidators.validateDate(this.date) || '';
    this.timeError = CustomTrainValidators.validateTime(this.time) || '';
    this.totalSeatsError = CustomTrainValidators.validateTotalSeats(this.totalSeats) || '';
    return !this.trainIdError && !this.nameError && !this.sourceError && !this.destinationError && !this.dateError && !this.timeError && !this.totalSeatsError;
  }

  addTrain() {
    this.adminError = '';
    this.adminSuccess = '';
    if (!this.validateForm()) {
      return;
    }
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
