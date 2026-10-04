import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { HomeComponent } from './home/home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ActivityLogListComponent } from './activity-log-list/activity-log-list.component';
import { AdminAuthService } from './admin-auth.service';

const routes: Routes = [
  { path: 'show-all-employees', component: EmployeeListComponent, canActivate: [AdminAuthService] },
  { path: 'add-employee', component: AddEmployeeComponent, canActivate: [AdminAuthService] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'updating-by-id/:id', component: UpdateEmployeeComponent, canActivate: [AdminAuthService] },
  { path: 'details-of-employee/:id', component: ShowDetailsComponent, canActivate: [AdminAuthService] },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AdminLoginComponent },
  { path: 'activity-log', component: ActivityLogListComponent, canActivate: [AdminAuthService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
