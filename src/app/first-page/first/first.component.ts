import { Component, NgZone, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit, OnDestroy {
  @Output() scrollToTrainSearch = new EventEmitter<void>();

  backgroundImages = [
    { src: 'assets/images/infrastruqtura-mtavari.jpg', name: 'ინფრასტრუქტურა' },
    { src: 'assets/images/samgzavro-mtavari.jpg', name: 'სამგზავრო გადაყვანები' },
    { src: 'assets/images/satvirto-mtavari.jpg', name: 'სამგზავრო გადაზიდვები' }
  ];
  currentBgIndex = 0;
  backgroundImage = this.backgroundImages[0].src;
  intervalId: any;

  menuOpen = false;
  tickets: any[] = [];
  ticketsModalOpen = false;
  isAdmin = false;
  persondata: any;
  private userSub?: Subscription;

  constructor(
    private zone: NgZone,
    private router: Router,
    public auth: AuthService,
    private userService: UserService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadUserTickets();
    this.preloadImages();
    this.startBackgroundRotation();
    if (this.isLoggedIn && !this.auth.userData) {
      this.auth.getUserData().subscribe();
    }
    this.persondata = this.auth?.userData;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.userSub?.unsubscribe();
  }

  // --- UI/Navigation Methods ---

  public logout(): void {
    this.auth.logout();
    this.menuOpen = false;
    location.reload();
  }

  public navigateTo(path: string): void {
    this.menuOpen = false;
    setTimeout(() => this.router.navigate(['/' + path]), 180);
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  public handleBookTicketClick(): void {
    this.menuOpen = false;
    setTimeout(() => this.scrollToTrainSearch.emit(), 180);
  }

  // --- Background Image Slider ---

  startBackgroundRotation(): void {
    this.intervalId = setInterval(() => {
      this.zone.run(() => {
        this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
        this.backgroundImage = this.backgroundImages[this.currentBgIndex].src;
      });
    }, 4000);
  }

  prevBackground(): void {
    this.currentBgIndex = (this.currentBgIndex - 1 + this.backgroundImages.length) % this.backgroundImages.length;
    this.backgroundImage = this.backgroundImages[this.currentBgIndex].src;
    this.resetInterval();
  }

  nextBackground(): void {
    this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
    this.backgroundImage = this.backgroundImages[this.currentBgIndex].src;
    this.resetInterval();
  }

  get prevName(): string {
    const prevIdx = (this.currentBgIndex - 1 + this.backgroundImages.length) % this.backgroundImages.length;
    return this.backgroundImages[prevIdx].name;
  }

  get nextName(): string {
    const nextIdx = (this.currentBgIndex + 1) % this.backgroundImages.length;
    return this.backgroundImages[nextIdx].name;
  }

  get currentName(): string {
    return this.backgroundImages[this.currentBgIndex].name;
  }

  resetInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startBackgroundRotation();
  }

  preloadImages(): void {
    this.backgroundImages.forEach(imgObj => {
      const img = new Image();
      img.src = imgObj.src;
    });
  }

  // --- Auth & Ticket Logic ---

  public get isLoggedIn(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const token = localStorage.getItem('jwt');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return !!payload && !!payload.sub;
    } catch {
      return false;
    }
  }

  

  /**
   * Loads tickets for the current user on init.
   */
  private loadUserTickets(): void {
    this.userSub = this.auth.getUserData().subscribe({
      next: (user: any) => {
         console.log('User data received:', user);
        if (!user || !user.role) {
          this.tickets = [];
          this.isAdmin = false;
          return;
        }
        if (user.role && user.role.toLowerCase() === 'admin') {
          this.isAdmin = true;
          this.adminService.getSoldTickets().subscribe({
            next: (tickets) => {
              this.tickets = Array.isArray(tickets) ? tickets : [];
            },
            error: (err) => {
              this.tickets = [];
            }
          });
        } else {
          this.isAdmin = false;
          this.userService.getTicketById(user.id).subscribe({
            next: (ticket) => {
              this.tickets = ticket ? [ticket] : [];
            },
            error: (err) => {
              this.tickets = [];
            }
          });
        }
      },
      error: () => {
        this.tickets = [];
        this.isAdmin = false;
      }
    });
  }

  /**
   * Opens the modal and loads tickets for the current user.
   */

  openTicketsModal(): void {
    if (!this.userData) {
      this.showLoginPromptModal = true;
      return;
    }
    this.ticketsModalOpen = true;
    this.loadUserTickets();
  }

  showAddTrainForm = false;
  addTrainData = {
    trainId: '',
    name: '',
    source: '',
    destination: '',
    date: '',
    time: '',
    totalSeats: ''
  };

  submitAddTrain(): void {
    const data = {
      trainId: Number(this.addTrainData.trainId),
      name: this.addTrainData.name,
      source: this.addTrainData.source,
      destination: this.addTrainData.destination,
      date: this.addTrainData.date,
      time: this.addTrainData.time,
      totalSeats: Number(this.addTrainData.totalSeats)
    };
    this.adminService.addTrain(data).subscribe({
      next: () => {
        alert('Train added successfully!');
        this.showAddTrainForm = false;
        this.addTrainData = { trainId: '', name: '', source: '', destination: '', date: '', time: '', totalSeats: '' };
      },
      error: (err) => alert('Failed to add train: ' + err)
    });
  }

  showLoginPromptModal = false;
  closeLoginPromptModal(): void {
    this.showLoginPromptModal = false;
  }

  closeTicketsModal(): void {
    this.ticketsModalOpen = false;
  }
   get userData(): any {
    // Always check for JWT in localStorage and decode if needed
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}
