
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { TrainService } from "../services/train.service";

@Component({
  selector: 'train-search',
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css']
})
export class TrainSearchComponent implements OnInit {
  source = '';
  destination = '';
  trains: any[] = [];
  error: string = '';
  buyMessage: string = '';
  seatInputs: { [trainId: number]: number } = {};

  constructor(private trainService: TrainService, private authService: AuthService) {}
  ngOnInit(): void {
    this.alltrain();
  }

  searchTrains(): void {
    this.error = '';
    this.buyMessage = '';
    this.trains = [];
    this.trainService.searchTrains(this.source, this.destination)
      .subscribe({
        next: (res: any) => this.trains = res,
        error: (err: any) => this.error = err
      });
  }

  buyTicket(train: any): void {
    this.buyMessage = '';
    this.error = '';
    const seatNumber = this.seatInputs[train.id];
    if (!seatNumber) {
      this.error = 'Please enter a seat number.';
      return;
    }
    const userData = this.authService.userData;

    const userId = userData?.id;
    if (typeof userId !== 'number') {
      this.error = 'You are Not Logged In.';
      return;
    }
    const data = {
      userId: userId,
      tickets: [
        { trainId: train.id, seatNumber: seatNumber }
      ]
    };
    this.trainService.buyTickets(data).subscribe({
      next: () => {
        this.buyMessage = 'Ticket purchased successfully!';
      },
      error: (err: any) => this.error = err
    });
  }

  alltrain(){
    this.trainService.getAllTrains().subscribe({
      next: (res: any) => {
        console.log(res);
        this.trains = res;
        this.error = '';
      },
      error: (err: any) => this.error = err
    });
  }
}
