import { useState, useCallback } from 'react';
import { MoodEntry } from '../types';
import { api } from '../lib/api';

export function useMoodData() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchMoodHistory = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming the backend has a GET /moods/trends endpoint
      const response = await api.get('/moods/trends');
      if (response.data) {
        setAverageScore(response.data.averageScore || 0);
        setMoodHistory(response.data.recentEntries || []);
      }
    } catch (error) {
      console.error('Failed to fetch mood history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    moodHistory,
    averageScore,
    loading,
    fetchMoodHistory,
  };
}
