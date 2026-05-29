export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  encryptionSalt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  encryptedTranscript: string;
  summary?: string;
  flowType: 'brain_dump' | 'quick_vent' | 'morning_checkin';
  durationSeconds?: number;
  overallSentiment?: number;
  categories: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  conversationId?: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  dueDate?: string;
  people: string[];
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  conversationId?: string;
  score: number;
  emotions: string[];
  triggers: string[];
  notes?: string;
  createdAt: string;
}

export interface ConversationUploadResponse {
  conversation: Conversation;
  transcript: string;
  aiResponse: string;
  tasks: Task[];
  mood: MoodEntry | null;
}
