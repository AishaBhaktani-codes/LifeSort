import { useState } from 'react';
import { MoodEntry } from '../types';

export function useMoodData() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMoodHistory = async () => {
    setLoading(true);
    // API logic to fetch mood entries and trend stats goes here
    setLoading(false);
  };

  return {
    moodHistory,
    loading,
    fetchMoodHistory,
  };
}
