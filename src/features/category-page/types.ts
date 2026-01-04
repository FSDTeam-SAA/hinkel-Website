export interface DashboardStats {
  totalRevenue: string;
  paidOrdersCount: number;
  totalUsersCount: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}
