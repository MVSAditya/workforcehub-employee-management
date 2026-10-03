import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminAuthService } from './admin-auth.service';

describe('AdminAuthService', () => {
  let service: AdminAuthService;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    service = TestBed.inject(AdminAuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => sessionStorage.clear());

  it('persists login state for the current session and clears it on logout', () => {
    expect(service.canActivate()).toEqual(router.parseUrl('/login'));

    service.login();
    expect(service.canActivate()).toBeTrue();
    expect(sessionStorage.getItem('workforcehub.admin.authenticated')).toBe('true');

    service.logout();
    expect(service.canActivate()).toEqual(router.parseUrl('/login'));
    expect(sessionStorage.getItem('workforcehub.admin.authenticated')).toBeNull();
  });

  it('redirects guests to login from protected routes', () => {
    const result = service.canActivate();
    expect(router.serializeUrl(result as ReturnType<Router['parseUrl']>)).toBe('/login');
  });
});
