import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AddEmployeeComponent } from './add-employee.component';
import { EmployeeService } from '../employee.service';

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeComponent;
  let fixture: ComponentFixture<AddEmployeeComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(() => {
    employeeService = jasmine.createSpyObj('EmployeeService', ['addEmployee']);
    employeeService.addEmployee.and.returnValue(of({ id: 1 }));

    TestBed.configureTestingModule({
      declarations: [AddEmployeeComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [{ provide: EmployeeService, useValue: employeeService }]
    });

    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit when the submit button is clicked', () => {
    spyOn(component, 'onSubmit');
    const button = fixture.nativeElement.querySelector('#reg');
    button.click();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
