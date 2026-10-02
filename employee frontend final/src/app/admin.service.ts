import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Admin {
  id?: number;
  adminName: string;
  adminPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseURL = '/api/v1/admins';
  static readonly DEFAULT_ADMIN = {
    adminName: 'admin_4827',
    adminPassword: 'R4nd0m!A7'
  };

  constructor(private httpClient: HttpClient) {}

  getAdmins(): Observable<Admin[]> {
    return this.httpClient.get<Admin[]>(this.baseURL);
  }
}
