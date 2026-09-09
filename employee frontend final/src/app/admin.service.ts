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
  private baseURL = 'http://localhost:8080/api/v1/admins';

  constructor(private httpClient: HttpClient) {}

  getAdmins(): Observable<Admin[]> {
    return this.httpClient.get<Admin[]>(this.baseURL);
  }
}
