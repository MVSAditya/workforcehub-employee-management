import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ActivityLog } from './activity-log';
import { ActivityLogService } from './activity-log.service';
import { AdminAuthService } from './admin-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  additionalFeaturesVisible = false;
  advancedControlsVisible = false;
  isAdminAuthenticated$ = this.adminAuthService.isAuthenticated$;
  liveActions$ = this.activityLogService.liveActions$;
  shareStatus = '';
  historyLoaded = false;
  historyLoadError = false;
  private savedActions: ActivityLog[] = [];

  toggleAdvancedControls(): void {
    this.advancedControlsVisible = !this.advancedControlsVisible;
  }

  setAdditionalFeaturesVisible(visible: boolean): void {
    this.additionalFeaturesVisible = visible;
    if (!visible) {
      this.advancedControlsVisible = false;
    }
  }

  logout(): void {
    this.adminAuthService.logout();
    this.additionalFeaturesVisible = false;
    this.advancedControlsVisible = false;
    this.router.navigate(['/login']);
  }

  constructor(
    private router: Router,
    private activityLogService: ActivityLogService,
    private adminAuthService: AdminAuthService
  ) {
    this.activityLogService.getLogs().subscribe({
      next: (actions) => {
        this.savedActions = actions;
        this.historyLoaded = true;
      },
      error: () => {
        this.historyLoadError = true;
        this.historyLoaded = true;
        this.shareStatus = 'Could not load previous LTAC history. Refresh to retry.';
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activityLogService.logAction(
          'PAGE_VIEW',
          event.urlAfterRedirects,
          'User opened page',
          'INFO'
        ).subscribe();
      }
    });

    document.addEventListener('click', (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest('button, a, input, select, option');
      const label = (
        interactive?.getAttribute('aria-label') ||
        interactive?.getAttribute('id') ||
        interactive?.textContent?.trim().replace(/\s+/g, ' ') ||
        target?.getAttribute('aria-label') ||
        target?.getAttribute('id') ||
        target?.tagName.toLowerCase() ||
        'unknown-element'
      ).slice(0, 60);
      const page = this.router.url || '/';

      this.activityLogService.logAction(
        'WEB_CLICK',
        page,
        `User clicked: ${label}`,
        'INFO'
      ).subscribe();
    });

    document.addEventListener('input', (event: Event) => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
        return;
      }

      const fieldName = field.id || field.getAttribute('name') || field.type || 'text-field';
      this.activityLogService.logAction(
        'FIELD_INPUT',
        this.router.url || '/',
        `User entered text in: ${fieldName}`,
        'INFO'
      ).subscribe();
    });

    document.addEventListener('change', (event: Event) => {
      const field = event.target;
      if (!(field instanceof HTMLSelectElement)) {
        return;
      }

      const fieldName = field.id || field.name || 'select-field';
      this.activityLogService.logAction(
        'FIELD_CHANGE',
        this.router.url || '/',
        `User changed selection: ${fieldName}`,
        'INFO'
      ).subscribe();
    });

    document.addEventListener('submit', (event: Event) => {
      const form = event.target;
      const formName = form instanceof HTMLFormElement ? form.id || form.getAttribute('name') : null;
      this.activityLogService.logAction(
        'FORM_SUBMIT',
        this.router.url || '/',
        `User submitted form: ${formName || 'unnamed-form'}`,
        'INFO'
      ).subscribe();
    });
  }

  async copySessionReport(): Promise<void> {
    await Promise.resolve();
    const allActions = [...this.savedActions];
    const knownActions = new Set(allActions.map(action => this.actionKey(action)));

    for (const action of this.activityLogService.getSessionActions()) {
      const key = this.actionKey(action);
      if (!knownActions.has(key)) {
        allActions.push(action);
        knownActions.add(key);
      }
    }

    allActions.sort((left, right) =>
      new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()
    );

    const completeHistoryAvailable = this.historyLoaded && !this.historyLoadError;
    const report = [
      `LTAC ${completeHistoryAvailable ? 'complete history' : 'current-tab actions only'}: ${allActions.length} actions`,
      ...allActions.flatMap((action, index) => {
        const assessment = this.activityLogService.evaluateAction(action, index + 1);
        return [
          `COUNT ${index + 1} | ID ${action.id ?? 'pending'} | ${action.timestamp} | ${action.user} | ${action.action} | ${action.status} | ${action.page}`,
          `  EXPECTED: ${assessment.expected}`,
          `  ACTUAL: ${assessment.actual}`,
          `  ASSESSMENT: ${assessment.finding}`
        ];
      })
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      this.shareStatus = completeHistoryAvailable
        ? `Copied ${allActions.length} actions from all sessions. Paste the report into this chat.`
        : `Copied ${allActions.length} current-tab actions. Previous history is still loading or unavailable.`;
    } catch {
      this.shareStatus = 'Clipboard access failed. Allow clipboard access and try again.';
    }
  }

  private actionKey(action: ActivityLog): string {
    return [action.user, action.page, action.action, action.status, action.timestamp, action.details || ''].join('\0');
  }
}
