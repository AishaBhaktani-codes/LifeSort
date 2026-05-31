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
      const session = useAuthStore.getState().session;
      const token = session?.access_token;
      const apiBaseUrl = api.defaults.baseURL;

      if (!token) {
        throw new Error('User is not authenticated');
      }

      console.log(`Uploading audio to ${apiBaseUrl}/conversations...`);

      // Build FormData — works on both web and native
      const formData = new FormData();
      formData.append('flowType', flowType);
      formData.append('durationSeconds', durationSeconds.toString());

      if (Platform.OS === 'web') {
        // On web, uri is a blob URL from the MediaRecorder — fetch it and append
        const audioBlob = await fetch(uri).then(r => r.blob());
        formData.append('audio', audioBlob, 'recording.webm');
      } else {
        // On native (iOS/Android), create a file object compatible with FormData
        const filename = uri.split('/').pop() || 'recording.m4a';
        formData.append('audio', {
          uri,
          name: filename,
          type: 'audio/m4a',
        } as any);
      }

      const response = await fetch(`${apiBaseUrl}/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type — browser sets it with boundary for multipart
        },
        body: formData,
      });

      if (response.ok) {
        const responseData: ConversationUploadResponse = await response.json();

        setActiveConversation(responseData.conversation);
        setActiveTranscript(responseData.transcript);
        setActiveAiResponse(responseData.aiResponse);
        setActiveTasks(responseData.tasks);
        setActiveMood(responseData.mood);

        // Prepend new conversation to list
        setConversations([responseData.conversation, ...conversations]);
        return true;
      } else {
        const errorBody = await response.text();
        throw new Error(`Upload failed (${response.status}): ${errorBody}`);
      }
    } catch (err: any) {
      console.error('Audio upload failed or server offline.', err.message);
      showAlert('Processing Error', 'Failed to process audio with the secure server. Ensure your backend is running.');
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
