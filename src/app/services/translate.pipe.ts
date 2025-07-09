import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from './translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false // impure pipe to update on language change
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private langSub: Subscription;

  constructor(private translationService: TranslationService, private cdr: ChangeDetectorRef) {
    this.langSub = this.translationService.onLangChange().subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }
}
