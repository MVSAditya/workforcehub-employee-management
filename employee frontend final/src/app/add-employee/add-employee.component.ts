import { Component } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LtacService } from '../ltac.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private ltacService: LtacService
  ) { }

  submitform!: NgForm;
  employee: Employee = new Employee();

  saveEmployee() {
    this.ltacService.trackAction(
      'ADD_EMPLOYEE_ATTEMPT',
      '/add-employee',
      `Submitting employee: ${this.employee.fname} ${this.employee.lname}`,
      'INFO'
    ).subscribe();

    this.employeeService.addEmployee(this.employee).subscribe({
      next: (data) => {
        console.log(data);
        this.ltacService.trackAction(
          'ADD_EMPLOYEE_SUCCESS',
          '/add-employee',
          `Employee ${this.employee.fname} ${this.employee.lname} was added successfully`,
          'SUCCESS'
        ).subscribe();
        this.goToEmployeeList();
      },
      error: (err) => {
        console.log(err);
        this.ltacService.trackAction(
          'ADD_EMPLOYEE_FAILED',
          '/add-employee',
          `Failed to add employee ${this.employee.fname} ${this.employee.lname}`,
          'ERROR'
        ).subscribe();
      }
    });
  }

  goToEmployeeList() {
    this.router.navigate(['/show-all-employees']);
  }

  ngOnInit(): void { }

  onSubmit() {
    console.log(this.employee);

    if (!this.employee.fname || !this.employee.lname || !this.employee.email || !this.employee.department || !this.employee.designation || !this.employee.joiningDate) {
      console.warn('Form is incomplete. Please fill all required fields.');
      this.ltacService.trackAction(
        'ADD_EMPLOYEE_INVALID',
        '/add-employee',
        'Submission blocked because required employee fields were missing',
        'WARNING'
      ).subscribe();
      return;
    }

    this.employee.salary = Number(this.employee.salary);
    this.saveEmployee();
  }
}








