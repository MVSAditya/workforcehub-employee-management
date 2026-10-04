import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LtacAction } from './ltac-action';
import { LtacService } from './ltac.service';
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
  liveActions$ = this.ltacService.liveActions$;
  shareStatus = '';

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
    private ltacService: LtacService,
    private adminAuthService: AdminAuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ltacService.trackAction(
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

      this.ltacService.trackAction(
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
      this.ltacService.trackAction(
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
      this.ltacService.trackAction(
        'FIELD_CHANGE',
        this.router.url || '/',
        `User changed selection: ${fieldName}`,
        'INFO'
      ).subscribe();
    });

    document.addEventListener('submit', (event: Event) => {
      const form = event.target;
      const formName = form instanceof HTMLFormElement ? form.id || form.getAttribute('name') : null;
      this.ltacService.trackAction(
        'FORM_SUBMIT',
        this.router.url || '/',
        `User submitted form: ${formName || 'unnamed-form'}`,
        'INFO'
      ).subscribe();
    });
  }

  async copySessionReport(): Promise<void> {
    await Promise.resolve();
    const allActions = this.ltacService.getSessionActions();

    const report = [
      `LTAC current-tab actions: ${allActions.length} actions`,
      ...allActions.flatMap((action, index) => {
        const assessment = this.ltacService.evaluateAction(action, index + 1);
        return [
          `COUNT ${index + 1} | ${action.timestamp} | ${action.user} | ${action.action} | ${action.status} | ${action.page}`,
          `  EXPECTED: ${assessment.expected}`,
          `  ACTUAL: ${assessment.actual}`,
          `  ASSESSMENT: ${assessment.finding}`
        ];
      })
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      this.shareStatus = `Copied ${allActions.length} current-tab actions. Paste the report into this chat.`;
    } catch {
      this.shareStatus = 'Clipboard access failed. Allow clipboard access and try again.';
    }
  }

}
