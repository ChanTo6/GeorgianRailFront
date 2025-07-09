import { Component } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <button (click)="setLang('en')">EN</button>
    <button (click)="setLang('ka')">KA</button>
  `,
  styles: [`button { margin: 0 0.5em; }`]
})
export class LanguageSwitcherComponent {
  constructor(private translationService: TranslationService) {}

  setLang(lang: string) {
    this.translationService.setLanguage(lang).subscribe();
  }
}
