import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'my-app';
  private langSub: any;

  constructor(public translationService: TranslationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.langSub = this.translationService.onLangChange().subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }

  get isAdmin(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const token = localStorage.getItem('jwt');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'Admin';
    } catch {
      return false;
    }
  }

  scrollToTrainSearchSection() {
    // Try to scroll immediately, and if not found, retry a few times (handles async rendering)
    let attempts = 0;
    const maxAttempts = 10;
    const scrollDuration = 900; // ms
    const tryScroll = () => {
      const el = document.getElementById('train-search-section');
      if (el) {
        // Custom smooth scroll for slower effect
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
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 60);
      }
    };
    tryScroll();
  }

  isAuthPage(): boolean {
    const path = window.location.pathname;
    return path === '/login' || path === '/register';
  }

  setLanguage(lang: string) {
    this.translationService.setLanguage(lang).subscribe();
  }
}
