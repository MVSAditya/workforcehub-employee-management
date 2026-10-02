import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../employee.service';
import { SalaryFormatPipe } from '../salary-format.pipe';
import { CustomDatePipe } from '../custom-date.pipe';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    employeeService = jasmine.createSpyObj<EmployeeService>('EmployeeService', ['getEmployeesList']);
    employeeService.getEmployeesList.and.returnValue(of([
      {
        id: 1,
        fname: 'Aisha',
        lname: 'Patel',
        email: 'aisha.patel@example.com',
        salary: 54000,
        department: 'Engineering',
        designation: 'Software Engineer',
        joiningDate: '2026-10-02'
      }
    ]));

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent, SalaryFormatPipe, CustomDatePipe],
      imports: [FormsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees from service on init', () => {
    expect(employeeService.getEmployeesList).toHaveBeenCalled();
    expect(component.employees.length).toBe(1);
    expect(component.employees[0].fname).toBe('Aisha');
  });
});
