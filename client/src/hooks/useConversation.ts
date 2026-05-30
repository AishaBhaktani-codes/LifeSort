import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { useConversationStore } from '../store/conversationStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { Conversation, ConversationUploadResponse } from '../types';
import { Alert } from 'react-native';

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
      // Removed hardcoded mock conversations
      Alert.alert('Error', 'Could not fetch your history. Please check your connection.');
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
      const token = useAuthStore.getState().token;
      const apiBaseUrl = api.defaults.baseURL;

      if (!token) {
        throw new Error('User is not authenticated');
      }

      console.log(`Uploading audio to ${apiBaseUrl}/conversations...`);

      const uploadResult = await FileSystem.uploadAsync(
        `${apiBaseUrl}/conversations`,
        uri,
        {
          fieldName: 'audio',
          httpMethod: 'POST',
          uploadType: 1 as any, // Bypass FileSystemUploadType vs UploadType typings mismatch
          headers: {
            Authorization: `Bearer ${token}`,
          },
          parameters: {
            flowType,
            durationSeconds: durationSeconds.toString(),
          },
        }
      );

      if (uploadResult.status === 200 || uploadResult.status === 201) {
        const responseData = JSON.parse(uploadResult.body) as ConversationUploadResponse;
        
        setActiveConversation(responseData.conversation);
        setActiveTranscript(responseData.transcript);
        setActiveAiResponse(responseData.aiResponse);
        setActiveTasks(responseData.tasks);
        setActiveMood(responseData.mood);

        // Prepend new conversation to list
        setConversations([responseData.conversation, ...conversations]);
        return true;
      } else {
        throw new Error(`Upload failed with status code ${uploadResult.status}`);
      }
    } catch (err: any) {
      console.error('Audio upload failed or server offline.', err.message);
      Alert.alert('Processing Error', 'Failed to process audio with the secure server. Ensure your backend is running.');
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
      Alert.alert('Error', 'Failed to delete session.');
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
