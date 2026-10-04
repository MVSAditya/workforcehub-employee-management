import { Component } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
import { LtacService } from '../ltac.service';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent {

  id: number;
  employee!: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeService: EmployeeService,
    private ltacService: LtacService
  ) {
    this.id = 0;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.ltacService.trackAction(
      'VIEW_EMPLOYEE_DETAILS',
      `/details-of-employee/${this.id}`,
      `Viewing employee record ${this.id}`,
      'INFO'
    ).subscribe();

    this.employee = new Employee();
    this.employeService.getEmployeeById(this.id).subscribe({
      next: (data) => {
        this.employee = data;
        this.ltacService.trackAction(
          'VIEW_EMPLOYEE_DETAILS_SUCCESS',
          `/details-of-employee/${this.id}`,
          `Employee ${this.id} loaded successfully`,
          'SUCCESS'
        ).subscribe();
      },
      error: (err) => {
        console.error(err);
        this.ltacService.trackAction(
          'VIEW_EMPLOYEE_DETAILS_FAILED',
          `/details-of-employee/${this.id}`,
          `Could not load employee ${this.id}`,
          'ERROR'
        ).subscribe();
      }
    });
  }
}
