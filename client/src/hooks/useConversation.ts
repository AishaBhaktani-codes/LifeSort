import { useState } from 'react';
import { Platform } from 'react-native';
import { useConversationStore } from '../store/conversationStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { Conversation, ConversationUploadResponse } from '../types';

// Cross-platform alert that works on web and native
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    // Dynamic import to avoid web bundling issues
    const { Alert } = require('react-native');
    Alert.alert(title, message);
  }
};

export function useConversation() {
  const {
    conversations,
    activeConversation,
    activeTranscript,
    activeAiResponse,
    activeTasks,
    activeMood,
    setConversations,
    setActiveConversation,
    setActiveTranscript,
    setActiveAiResponse,
    setActiveTasks,
    setActiveMood,
    clearActiveSession,
  } = useConversationStore();

  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await api.get<Conversation[]>('/conversations');
      setConversations(response.data);
    } catch (err: any) {
      console.warn('API /conversations failed', err.message);
      showAlert('Error', 'Could not fetch your history. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const uploadConversation = async (
    uri: string,
    flowType: 'brain_dump' | 'quick_vent' | 'morning_checkin',
    durationSeconds: number
  ): Promise<boolean> => {
    setLoading(true);
    clearActiveSession();

    try {
      // DUMMY DATA FOR DEMO
      console.log('Simulating secure backend processing...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const dummyId = Math.random().toString(36).substring(7);
      const now = new Date().toISOString();
      
      let dummyTranscript = "";
      let dummyAiResponse = "";
      let dummyTasks: any[] = [];
      
      if (flowType === 'brain_dump') {
        dummyTranscript = "I've been feeling so overwhelmed lately. I need to finish the quarterly report by Friday, and I keep forgetting to call mom back. Oh, and I really should book those flights for the conference in Austin before prices go up.";
        dummyAiResponse = "It sounds like you have a lot on your plate right now, especially with the quarterly report weighing on you. I've broken down your scattered thoughts into clear tasks so you don't have to hold it all in your head. Take a deep breath—you've got this.";
        dummyTasks = [
          { id: `t1_${dummyId}`, userId: 'user', title: 'Finish quarterly report', priority: 'high', status: 'pending', dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), people: [], createdAt: now },
          { id: `t2_${dummyId}`, userId: 'user', title: 'Call mom back', priority: 'medium', status: 'pending', people: ['Mom'], createdAt: now },
          { id: `t3_${dummyId}`, userId: 'user', title: 'Book flights for Austin conference', priority: 'medium', status: 'pending', people: [], createdAt: now }
        ];
      } else if (flowType === 'quick_vent') {
        dummyTranscript = "I'm so frustrated with the new API changes. They completely broke our staging environment and nobody communicated it. It took me three hours to track down the issue.";
        dummyAiResponse = "That sounds incredibly frustrating. Dealing with unannounced breaking changes is a huge drain on your time and energy. It's completely valid to feel annoyed about those lost three hours. I've noted this down—maybe it's worth bringing up team communication at the next sync.";
        dummyTasks = [
          { id: `t1_${dummyId}`, userId: 'user', title: 'Bring up API communication protocol at team sync', priority: 'medium', status: 'pending', people: ['Team'], createdAt: now }
        ];
      } else {
        dummyTranscript = "Today I want to focus on just getting through the design reviews. If I can finish those and maybe hit the gym later, I'll consider it a good day.";
        dummyAiResponse = "That's a great mindset for the day. Setting clear, manageable goals like the design reviews and prioritizing your physical health with a gym session sets a very positive tone. Let's make it a great day.";
        dummyTasks = [
          { id: `t1_${dummyId}`, userId: 'user', title: 'Complete design reviews', priority: 'high', status: 'pending', people: [], createdAt: now },
          { id: `t2_${dummyId}`, userId: 'user', title: 'Go to the gym', category: 'Health', priority: 'low', status: 'pending', people: [], createdAt: now }
        ];
      }

      const responseData: ConversationUploadResponse = {
        conversation: {
          id: dummyId,
          userId: 'user',
          title: `${flowType.replace('_', ' ')} Session`,
          encryptedTranscript: 'encrypted_blob',
          summary: dummyAiResponse.substring(0, 100) + '...',
          flowType: flowType,
          durationSeconds: durationSeconds,
          overallSentiment: 0.8,
          categories: ['Work', 'Personal'],
          createdAt: now
        },
        transcript: dummyTranscript,
        aiResponse: dummyAiResponse,
        tasks: dummyTasks,
        mood: {
          id: `m_${dummyId}`,
          userId: 'user',
          score: 0.7,
          emotions: ['overwhelmed', 'focused'],
          triggers: ['work', 'family'],
          notes: 'User is dealing with a high cognitive load but remains proactive.',
          createdAt: now
        }
      };

      setActiveConversation(responseData.conversation);
      setActiveTranscript(responseData.transcript);
      setActiveAiResponse(responseData.aiResponse);
      setActiveTasks(responseData.tasks);
      setActiveMood(responseData.mood);

      // Prepend new conversation to list
      setConversations([responseData.conversation, ...conversations]);
      return true;

    } catch (err: any) {
      console.error('Audio upload failed or server offline.', err.message);
      showAlert('Processing Error', 'Failed to process audio. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await api.delete(`/conversations/${id}`);
      setConversations(conversations.filter((c) => c.id !== id));
      if (activeConversation?.id === id) {
        clearActiveSession();
        setActiveConversation(null);
      }
      return true;
    } catch (err: any) {
      console.warn('API delete failed', err.message);
      showAlert('Error', 'Failed to delete session.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    activeConversation,
    activeTranscript,
    activeAiResponse,
    activeTasks,
    activeMood,
    loading,
    fetchConversations,
    uploadConversation,
    deleteConversation,
    clearActiveSession,
  };
}
