import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate {
  private readonly authenticated = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.authenticated.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.checkAuthentication().subscribe();
  }

  get isAuthenticated(): boolean {
    return this.authenticated.value;
  }

  login(username: string, password: string): Observable<string> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post('/api/v1/auth/login', body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text'
    }).pipe(tap(() => this.authenticated.next(true)));
  }

  logout(): void {
    this.http.post('/api/v1/auth/logout', '').subscribe({
      next: () => this.authenticated.next(false),
      error: (error) => {
        this.authenticated.next(false);
        if (error.status !== 401) {
          console.error('Unable to end the server session', error);
        }
      }
    });
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkAuthentication().pipe(
      map((authenticated) => authenticated || this.router.parseUrl('/login'))
    );
  }

  private checkAuthentication(): Observable<boolean> {
    return this.http.get('/api/v1/auth/status').pipe(
      map(() => {
        this.authenticated.next(true);
        return true;
      }),
      catchError((error) => {
        this.authenticated.next(false);
        if (error.status !== 401) {
          console.error('Unable to check the server session', error);
        }
        return of(false);
      })
    );
  }
}
