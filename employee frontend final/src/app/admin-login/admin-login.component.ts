import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { ActivityLogService } from '../activity-log.service';
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
    private adminService: AdminService,
    private router: Router,
    private activityLogService: ActivityLogService,
    private adminAuthService: AdminAuthService
  ) {}

  login() {
    const defaultAdmin = AdminService.DEFAULT_ADMIN;
    this.activityLogService.logAction(
      'LOGIN_ATTEMPT',
      '/login',
      `Attempting login for user ${this.username.trim() || 'unknown'}`,
      'INFO',
      this.username.trim() || 'guest'
    ).subscribe();

    if (
      this.username.trim() === defaultAdmin.adminName &&
      this.password === defaultAdmin.adminPassword
    ) {
      this.activityLogService.logAction(
        'LOGIN_SUCCESS',
        '/login',
        'Default admin login succeeded',
        'SUCCESS',
        this.username.trim()
      ).subscribe();
      this.adminAuthService.login();
      this.router.navigate(['/show-all-employees']);
      return;
    }

    this.adminService.getAdmins().subscribe({
      next: (admins) => {
        const matched = admins.find(
          (admin) => admin.adminName === this.username && admin.adminPassword === this.password
        );

        if (matched) {
          this.activityLogService.logAction(
            'LOGIN_SUCCESS',
            '/login',
            'Admin login succeeded using stored credentials',
            'SUCCESS',
            this.username
          ).subscribe();
          this.adminAuthService.login();
          this.router.navigate(['/show-all-employees']);
        } else {
          this.errorMessage = 'Invalid username or password';
          this.activityLogService.logAction(
            'LOGIN_FAILED',
            '/login',
            `Failed login for ${this.username} with invalid credentials`,
            'ERROR',
            this.username || 'guest'
          ).subscribe();
        }
      },
      error: () => {
        this.errorMessage = 'Unable to validate admin user';
        this.activityLogService.logAction(
          'LOGIN_FAILED',
          '/login',
          'Admin validation service failed',
          'ERROR',
          this.username || 'guest'
        ).subscribe();
      }
    });
  }
}
