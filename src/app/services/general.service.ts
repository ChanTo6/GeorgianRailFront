import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeneralService {
  private adminPanelVisibleSubject = new BehaviorSubject<boolean>(false);
  adminPanelVisible$ = this.adminPanelVisibleSubject.asObservable();

  toggleAdminPanel() {
    this.adminPanelVisibleSubject.next(!this.adminPanelVisibleSubject.value);
  }

  setAdminPanelVisible(visible: boolean) {
    this.adminPanelVisibleSubject.next(visible);
  }
}