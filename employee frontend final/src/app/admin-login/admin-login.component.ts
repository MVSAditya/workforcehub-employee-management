import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LtacService } from '../ltac.service';
import { AdminAuthService } from '../admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private ltacService: LtacService,
    private adminAuthService: AdminAuthService
  ) {}

  login() {
    this.errorMessage = '';
    this.adminAuthService.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.ltacService.trackAction(
          'LOGIN_SUCCESS',
          '/login',
          'Admin login succeeded',
          'SUCCESS',
          this.username.trim()
        ).subscribe();
        this.router.navigate(['/show-all-employees']);
      },
      error: (error) => {
        this.errorMessage = error.status === 401
          ? 'Invalid username or password'
          : 'Unable to validate admin user';
        if (error.status !== 401) {
          console.error('Unable to validate admin user', error);
        }
      }
    });
  }
}
