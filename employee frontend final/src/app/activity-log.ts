export interface ActivityLog {
  id?: number;
  user: string;
  page: string;
  action: string;
  details?: string;
  status: string;
  timestamp: string;
}
