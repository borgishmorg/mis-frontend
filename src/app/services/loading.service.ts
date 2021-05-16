import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingBehavior = new BehaviorSubject<boolean>(false);

  private _isLoading: Observable<boolean>;
  public get isLoading(): Observable<boolean> {
    return this._isLoading;
  }

  constructor(private router: Router) {
    this._isLoading = this.isLoadingBehavior.asObservable();
    // stop loading when change tab (in case of infinite loading)
    router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationStart) {
          this.isLoadingBehavior.next(false);
        }
      },
    });
  }

  public startLoading() {
    this.isLoadingBehavior.next(true);
  }

  public stopLoading() {
    this.isLoadingBehavior.next(false);
  }
}
