import { Component } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { ActivityLogService } from '../activity-log.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {

  employees: Employee[];
  EnteredID!: number;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activityLogService: ActivityLogService
  ) {
    this.employees = [];
  }

  ngOnInit(): void {
    this.activityLogService.logAction(
      'VIEW_EMPLOYEE_LIST',
      '/show-all-employees',
      'User opened the employee list',
      'INFO'
    ).subscribe();
    this.getEmployees();
  }

  goToEmployee() {
    console.log(this.EnteredID);
    this.router.navigate(['details-of-employee', this.EnteredID]);
  }

  getEmployees() {
    this.employeeService.getEmployeesList().subscribe({
      next: (data) => {
        this.employees = data;
        this.activityLogService.logAction(
          'EMPLOYEE_LIST_REFRESH',
          '/show-all-employees',
          `Loaded ${data.length} employees`,
          'INFO'
        ).subscribe();
      },
      error: (err) => {
        console.error(err);
        this.activityLogService.logAction(
          'EMPLOYEE_LIST_ERROR',
          '/show-all-employees',
          'Error loading employee list',
          'ERROR'
        ).subscribe();
      }
    });
  }

  updateEmployee(id: number) {
    this.activityLogService.logAction(
      'UPDATE_EMPLOYEE_OPEN',
      '/show-all-employees',
      `Opening update form for employee ${id}`,
      'INFO'
    ).subscribe();
    this.router.navigate(['updating-by-id', id]);
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure to delete Employee ID: ' + id)) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (data) => {
          console.log(data);
          this.activityLogService.logAction(
            'DELETE_EMPLOYEE_SUCCESS',
            '/show-all-employees',
            `Deleted employee ${id}`,
            'SUCCESS'
          ).subscribe();
          this.getEmployees();
        },
        error: (err) => {
          console.error(err);
          this.activityLogService.logAction(
            'DELETE_EMPLOYEE_FAILED',
            '/show-all-employees',
            `Failed to delete employee ${id}`,
            'ERROR'
          ).subscribe();
        }
      });
    }
  }

  detailsOfEmployee(id: number) {
    this.activityLogService.logAction(
      'VIEW_EMPLOYEE_DETAILS',
      '/show-all-employees',
      `Viewing employee ${id}`,
      'INFO'
    ).subscribe();
    this.router.navigate(['details-of-employee', id]);
  }
}
