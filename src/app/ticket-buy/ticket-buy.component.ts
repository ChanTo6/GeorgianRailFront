import { Component } from '@angular/core';
import { TrainService } from '../services/train.service';

@Component({
  selector: 'ticket-buy',
  templateUrl: './ticket-buy.component.html',
  styleUrls: ['./ticket-buy.component.css']
})
export class TicketBuyComponent {
  userId: number | null = null;
  trainId: number | null = null;
  seatNumber: number | null = null;
  success = '';
  error = '';

  constructor(private trainService: TrainService) {}

  buyTickets() {
    this.success = '';
    this.error = '';
    if (this.userId && this.trainId && this.seatNumber) {
      this.trainService.buyTickets({
        userId: this.userId,
        tickets: [{ trainId: this.trainId, seatNumber: this.seatNumber }]
      }).subscribe({
        next: () => this.success = 'Ticket purchased!',
        error: err => this.error = err
      });
    } else {
      this.error = 'All fields are required.';
    }
  }
}
