import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityLog } from '../activity-log';
import { ActivityLogService } from '../activity-log.service';

@Component({
  selector: 'app-activity-log-list',
  templateUrl: './activity-log-list.component.html',
  styleUrls: ['./activity-log-list.component.css']
})
export class ActivityLogListComponent implements OnInit, OnDestroy {
  logs: ActivityLog[] = [];
  private refreshIntervalId?: number;

  constructor(private activityLogService: ActivityLogService) {}

  ngOnInit(): void {
    this.loadLogs();
    this.refreshIntervalId = window.setInterval(() => this.loadLogs(), 5000);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      window.clearInterval(this.refreshIntervalId);
    }
  }

  loadLogs(): void {
    this.activityLogService.getLogs().subscribe({
      next: (data) => this.logs = data,
      error: (err) => console.error('Unable to load activity logs', err)
    });
  }
}
