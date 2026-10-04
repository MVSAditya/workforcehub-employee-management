import { Component } from '@angular/core';
import { Employee } from '../employee';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { LtacService } from '../ltac.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent {

  id: number;
  employee: Employee = new Employee();

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private ltacService: LtacService
  ) {
    this.id = 0;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.ltacService.trackAction(
      'OPEN_UPDATE_FORM',
      `/updating-by-id/${this.id}`,
      `Opening update form for employee ${this.id}`,
      'INFO'
    ).subscribe();

    this.employeeService.getEmployeeById(this.id).subscribe({
      next: (data) => {
        this.employee = data;
      },
      error: (err) => {
        console.log(err);
        this.ltacService.trackAction(
          'OPEN_UPDATE_FORM_FAILED',
          `/updating-by-id/${this.id}`,
          `Could not load employee ${this.id} for update`,
          'ERROR'
        ).subscribe();
      }
    });
  }

  onSubmit() {
    this.ltacService.trackAction(
      'UPDATE_EMPLOYEE_ATTEMPT',
      `/updating-by-id/${this.id}`,
      `Updating employee ${this.id}`,
      'INFO'
    ).subscribe();

    this.employeeService.updateEmployee(this.id, this.employee).subscribe({
      next: (data) => {
        this.ltacService.trackAction(
          'UPDATE_EMPLOYEE_SUCCESS',
          `/updating-by-id/${this.id}`,
          `Employee ${this.id} updated successfully`,
          'SUCCESS'
        ).subscribe();
        this.goToEmployeeList();
      },
      error: (err) => {
        console.log(err);
        this.ltacService.trackAction(
          'UPDATE_EMPLOYEE_FAILED',
          `/updating-by-id/${this.id}`,
          `Failed to update employee ${this.id}`,
          'ERROR'
        ).subscribe();
      }
    });
  }

  goToEmployeeList() {
    this.router.navigate(['/show-all-employees']);
  }
}
