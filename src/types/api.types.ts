/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Filter parameters for list queries */
export interface FilterParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

/** Dashboard statistics */
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  pendingEnrollments: number;
  totalInstructors: number;
  activeCourses: number;
  upcomingSchedules: number;
  upcomingEvents: number;
  pendingPayments: number;
}
