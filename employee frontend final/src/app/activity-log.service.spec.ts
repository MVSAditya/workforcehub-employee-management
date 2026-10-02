import { HttpClient } from '@angular/common/http';
import { ActivityLog } from './activity-log';
import { ActivityLogService } from './activity-log.service';

describe('ActivityLogService workflow assessment', () => {
  let service: ActivityLogService;

  const makeLog = (overrides: Partial<ActivityLog> = {}): ActivityLog => ({
    user: 'admin_4827',
    page: '/show-all-employees',
    action: 'VIEW_EMPLOYEE_LIST',
    status: 'INFO',
    details: 'User opened the employee list',
    timestamp: '2026-10-02T13:00:00Z',
    ...overrides
  });

  beforeEach(() => {
    service = new ActivityLogService({} as unknown as HttpClient);
  });

  it('flags a failed backend action as an error against its expected workflow', () => {
    const result = service.evaluateAction(makeLog({
      action: 'EMPLOYEE_LIST_ERROR',
      status: 'ERROR',
      details: 'Employee API unavailable'
    }), 1);

    expect(result.expected).toContain('employee collection should load');
    expect(result.actual).toContain('Employee API unavailable');
    expect(result.finding).toBe('ERROR');
  });

  it('marks a rejected invalid form as expected validation behavior', () => {
    const result = service.evaluateAction(makeLog({
      action: 'ADD_EMPLOYEE_INVALID',
      status: 'WARNING',
      details: 'Required fields were missing'
    }), 2);

    expect(result.expected).toContain('Valid employee data should create');
    expect(result.actual).toContain('Validation blocked');
    expect(result.finding).toBe('PASS');
  });

  it('keeps an action attempt pending until a success or failure is logged', () => {
    const result = service.evaluateAction(makeLog({
      action: 'LOGIN_ATTEMPT',
      page: '/login',
      details: 'Attempting login'
    }), 3);

    expect(result.finding).toBe('PENDING');
    expect(result.actual).toContain('Waiting for a success or failure event');
  });

  it('marks an empty employee response as a warning', () => {
    const result = service.evaluateAction(makeLog({
      action: 'EMPLOYEE_LIST_REFRESH',
      details: 'Loaded 0 employees'
    }), 4);

    expect(result.finding).toBe('WARNING');
    expect(result.actual).toContain('returned no employees');
  });

  it('flags action types without an expectation rule for review', () => {
    const result = service.evaluateAction(makeLog({ action: 'UNMAPPED_ACTION' }), 5);

    expect(result.expected).toContain('not been configured');
    expect(result.finding).toBe('WARNING');
  });
});
