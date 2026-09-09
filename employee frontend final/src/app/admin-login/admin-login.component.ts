import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

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
    private router: Router
  ) {}

  login() {
    this.adminService.getAdmins().subscribe({
      next: (admins) => {
        const matched = admins.find(
          (admin) => admin.adminName === this.username && admin.adminPassword === this.password
        );

        if (matched) {
          this.router.navigate(['/show-all-employees']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: () => {
        this.errorMessage = 'Unable to validate admin user';
      }
    });
  }
}
