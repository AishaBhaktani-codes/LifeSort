import { useState, useCallback } from 'react';
import { api } from '../lib/api';

interface DashboardStats {
  sessionCount: number;
  avgMoodScore: number;
  pendingTaskCount: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    sessionCount: 0,
    avgMoodScore: 0,
    pendingTaskCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<DashboardStats>('/dashboard');
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.warn('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    fetchDashboardStats,
  };
}
