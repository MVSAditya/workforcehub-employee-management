import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate {
  private readonly storageKey = 'workforcehub.admin.authenticated';
  private readonly authenticated = new BehaviorSubject<boolean>(
    sessionStorage.getItem(this.storageKey) === 'true'
  );
  readonly isAuthenticated$ = this.authenticated.asObservable();

  constructor(private router: Router) {}

  login(): void {
    sessionStorage.setItem(this.storageKey, 'true');
    this.authenticated.next(true);
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    this.authenticated.next(false);
  }

  canActivate(): boolean | UrlTree {
    return this.authenticated.value || this.router.parseUrl('/login');
  }
}
