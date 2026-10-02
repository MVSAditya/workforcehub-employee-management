import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityLog } from './activity-log';

export interface LiveAction extends ActivityLog {
  count: number;
  expected: string;
  actual: string;
  finding: WorkflowFinding;
}

export type WorkflowFinding = 'PASS' | 'PENDING' | 'WARNING' | 'ERROR' | 'OBSERVED';

const workflowExpectations: Record<string, string> = {
  PAGE_VIEW: 'The requested route should resolve and its page should render.',
  WEB_CLICK: 'The clicked target should receive the click and run its configured behavior.',
  FIELD_INPUT: 'The field should accept input without recording the entered value.',
  FIELD_CHANGE: 'The selected option should update the control.',
  FORM_SUBMIT: 'Validation should run, then the create or update request should finish.',
  LOGIN: 'Credentials should be checked, then login should succeed or show a rejection.',
  ADD_EMPLOYEE: 'Valid employee data should create one record and refresh the list.',
  UPDATE_EMPLOYEE: 'Valid edits should persist for the selected employee.',
  DELETE_EMPLOYEE: 'A confirmed deletion should remove the record and refresh the list.',
  EMPLOYEE_LIST: 'The employee collection should load from the backend and render.',
  VIEW_EMPLOYEE_LIST: 'The employee collection should load from the backend and render.',
  VIEW_EMPLOYEE_DETAILS: 'The selected employee should load and display by ID.',
  OPEN_UPDATE_FORM: 'The selected employee should load into the update form.'
};

const fallbackExpectation = 'Define an expected workflow for this action.';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private baseUrl = '/api/v1/activity-logs';
  private actionCount = 0;
  private readonly sessionActions: LiveAction[] = [];
  private readonly liveActionsSubject = new BehaviorSubject<LiveAction[]>([]);
  readonly liveActions$ = this.liveActionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(this.baseUrl);
  }

  addLog(log: ActivityLog): Observable<ActivityLog> {
    return this.http.post<ActivityLog>(this.baseUrl, log);
  }

  getSessionActions(): LiveAction[] {
    return [...this.sessionActions];
  }

  evaluateAction(log: ActivityLog, count: number): LiveAction {
    const action = log.action.toUpperCase();
    const normalizedAction = action.replace(/_(ATTEMPT|SUCCESS|FAILED|ERROR|INVALID|REFRESH|OPEN)$/, '');
    const expected = workflowExpectations[action] || workflowExpectations[normalizedAction] || fallbackExpectation;
    const details = log.details || `${action} event recorded.`;
    const failed = log.status.toUpperCase() === 'ERROR' || /_(FAILED|ERROR)$/.test(action);
    const invalidInput = /_INVALID$/.test(action);
    const awaitingOutcome = /_ATTEMPT$/.test(action) || action === 'FORM_SUBMIT' || action === 'LOGIN';
    const emptyEmployeeList = action === 'EMPLOYEE_LIST_REFRESH' && /loaded 0 employees/i.test(details);
    const succeeded = log.status.toUpperCase() === 'SUCCESS' || /_SUCCESS$/.test(action) ||
      action === 'PAGE_VIEW' || action === 'EMPLOYEE_LIST_REFRESH';

    let finding: WorkflowFinding = 'OBSERVED';
    let actual = details;
    if (failed) {
      finding = 'ERROR';
      actual = `Failure reported: ${details}`;
    } else if (emptyEmployeeList) {
      finding = 'WARNING';
      actual = `The backend returned no employees. ${details}`;
    } else if (invalidInput) {
      finding = 'PASS';
      actual = `Validation blocked the invalid submission as expected. ${details}`;
    } else if (awaitingOutcome) {
      finding = 'PENDING';
      actual = `${details} Waiting for a success or failure event.`;
    } else if (succeeded || action === 'FIELD_INPUT' || action === 'FIELD_CHANGE') {
      finding = 'PASS';
    } else if (expected === fallbackExpectation) {
      finding = 'WARNING';
    }

    return { ...log, count, expected, actual, finding };
  }

  logAction(action: string, page: string, details: string, status: string = 'INFO', user: string = 'admin_4827'): Observable<ActivityLog> {
    const log: ActivityLog = {
      user,
      page,
      action,
      details,
      status,
      timestamp: new Date().toISOString()
    };

    const liveAction = this.evaluateAction(log, ++this.actionCount);
    this.sessionActions.push(liveAction);
    this.liveActionsSubject.next([
      liveAction,
      ...this.liveActionsSubject.value.slice(0, 29)
    ]);

    return this.addLog(log);
  }
}
