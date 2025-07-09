import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations: { [key: string]: string } = {};
  private currentLang = 'en';
  private apiUrl = 'https://localhost:7145/api/Translations';
  private langChange$ = new BehaviorSubject<string>(this.currentLang);

  constructor(private http: HttpClient) {}

  setLanguage(lang: string): Observable<any> {
    // console.log('setLanguage called with:', lang);
    if (lang === this.currentLang && Object.keys(this.translations).length > 0) {
      // console.log('Already current language and translations loaded:', lang, this.translations);
      return of(this.translations);
    }
    return this.http.get<{ [key: string]: string }>(`${this.apiUrl}/${lang}`).pipe(
      tap(trans => {
        // console.log('Fetched translations for', lang, trans);
        this.translations = trans;
        this.currentLang = lang;
        this.langChange$.next(lang);
        // console.log('Updated state:', { lang, translations: this.translations });
      }),
      catchError(() => {
        // fallback to English if error
        // console.log('Error fetching translations for', lang, 'falling back to en');
        if (lang !== 'en') {
          return this.http.get<{ [key: string]: string }>(`${this.apiUrl}/en`).pipe(
            tap(trans => {
              console.log('Fetched fallback translations for en', trans);
              this.translations = trans;
              this.currentLang = 'en';
              this.langChange$.next('en');
            })
          );
        }
        return of({});
      })
    );
  }
getAllTranslations(): Observable<{ [lang: string]: { [key: string]: string } }> {
  return this.http.get<{ [lang: string]: { [key: string]: string } }>(this.apiUrl);
}
  onLangChange() {
    // console.log('onLangChange called, currentLang:', this.currentLang);
    return this.langChange$.asObservable();
  }

  translate(key: string): string {
    const value = this.translations[key];
    // console.log('translate called for key:', key, '->', value);
    if (value) {
      return value;
    }
    // fallback: show key if not found
    return key;
  }

  getCurrentLang(): string {
    // console.log('getCurrentLang called:', this.currentLang);
    return this.currentLang;
  }
}
