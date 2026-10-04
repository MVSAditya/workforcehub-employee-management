import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAuthService } from './admin-auth.service';

describe('AdminAuthService', () => {
  let service: AdminAuthService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AdminAuthService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingController.expectOne('/api/v1/auth/status').flush(null, {
      status: 401,
      statusText: 'Unauthorized'
    });
  });

  afterEach(() => httpTestingController.verify());

  it('authenticates against the server and clears the session on logout', () => {
    let loginResult = '';
    service.login('admin', 'secret').subscribe((result) => loginResult = result);
    const loginRequest = httpTestingController.expectOne('/api/v1/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toBe('username=admin&password=secret');
    loginRequest.flush('');
    expect(loginResult).toBe('');
    expect(service.isAuthenticated).toBeTrue();

    service.logout();
    httpTestingController.expectOne('/api/v1/auth/logout').flush(null, {
      status: 204,
      statusText: 'No Content'
    });
    expect(service.isAuthenticated).toBeFalse();
  });

  it('redirects guests to login when the server rejects the session', () => {
    let result: boolean | ReturnType<Router['parseUrl']> | undefined;
    service.canActivate().subscribe((value) => result = value);
    httpTestingController.expectOne('/api/v1/auth/status').flush(null, {
      status: 401,
      statusText: 'Unauthorized'
    });
    expect(router.serializeUrl(result as ReturnType<Router['parseUrl']>)).toBe('/login');
  });
});
