import { Component, NgZone, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit, OnDestroy {
  showProfileModal = false;
   profileData: any = {};
  profileMessage: string = '';

  showAdminPanelModal = false;

  openProfileModal(): void {
    this.showProfileModal=true;
    this.profileMessage = '';
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profileData = { ...data, password: '' }; 
        this.showProfileModal = true;
      },
      error: () => {
        this.profileMessage = 'Failed to load profile.';
      }
    });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.profileData = null;
    this.profileMessage = '';
  }

  submitProfileUpdate(): void {
    const updateData: any = { ...this.profileData };
    if (!updateData.password) delete updateData.password;
    this.userService.updateProfile(updateData).subscribe({
      next: () => {
        this.profileMessage = 'Profile updated successfully!';
        setTimeout(() => this.closeProfileModal(), 1200);
      },
      error: (err) => {
        this.profileMessage = 'Failed to update profile.';
      }
    });
  }
  userOnlyAction(): void {
    alert('User-only action triggered!');
  }
  private adminPanelSub?: Subscription;
  @Output() scrollToTrainSearch = new EventEmitter<void>();

  backgroundImages = [
    { src: 'assets/images/infrastruqtura-mtavari.jpg', name: 'infrastructure' },
    { src: 'assets/images/samgzavro-mtavari.jpg', name: 'passenger transportation' },
    { src: 'assets/images/satvirto-mtavari.jpg', name: 'freight transportation' }
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
  currentLang: string;

  constructor(
    private zone: NgZone,
    private router: Router,
    public auth: AuthService,
    private userService: UserService,
    private adminService: AdminService,
    private translationService: TranslationService,
    private generalService: GeneralService
  ) {
    this.currentLang = this.translationService.getCurrentLang();
    this.translationService.onLangChange().subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }
  
  public toggleAdminPanel(): void {
    this.menuOpen = false;
    this.showAdminPanelModal = true;
  }

  closeAdminPanelModal(): void {
    this.showAdminPanelModal = false;
  }

  ngOnInit(): void {
    this.loadUserTickets();
    this.preloadImages();
    this.startBackgroundRotation();
    if (this.isLoggedIn && !this.auth.userData) {
      this.auth.getUserData().subscribe();
    }
    this.persondata = this.auth?.userData;
   
    this.adminPanelSub = this.generalService.adminPanelVisible$.subscribe(visible => {
      if (visible) {
        setTimeout(() => {
          const el = document.getElementById('admin-panel-root');
          if (el) {
         
            const scrollDuration = 900; 
            const targetY = el.getBoundingClientRect().top + window.pageYOffset;
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            let startTime: number | null = null;
            function easeInOutQuad(t: number) {
              return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
            function animateScroll(currentTime: number) {
              if (!startTime) startTime = currentTime;
              const timeElapsed = currentTime - startTime;
              const progress = Math.min(timeElapsed / scrollDuration, 1);
              const ease = easeInOutQuad(progress);
              window.scrollTo(0, startY + distance * ease);
              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              }
            }
            requestAnimationFrame(animateScroll);
          }
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.userSub?.unsubscribe();
    this.adminPanelSub?.unsubscribe();
  }



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
          this.userService.getTicketsByUserId(user.id).subscribe({
            next: (tickets) => {
              this.tickets = Array.isArray(tickets) ? tickets : [];
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
  
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  setLanguage(lang: string) {
    this.translationService.setLanguage(lang).subscribe(() => {
      this.currentLang = lang;
    });
  }
}