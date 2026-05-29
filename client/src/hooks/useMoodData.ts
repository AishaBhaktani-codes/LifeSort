import { useState, useCallback } from 'react';
import { MoodEntry } from '../types';
import { api } from '../lib/api';

export function useMoodData() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMoodHistory = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming the backend has a GET /moods endpoint
      const response = await api.get('/moods');
      if (response.data) {
        setMoodHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch mood history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    moodHistory,
    loading,
    fetchMoodHistory,
  };
}
