import { useState } from 'react';
import { useConversationStore } from '../store/conversationStore';

export function useConversation() {
  const { conversations, activeConversation, setConversations, setActiveConversation } = useConversationStore();
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    // API logic to fetch conversations goes here
    setLoading(false);
  };

  const uploadConversation = async (uri: string) => {
    setLoading(true);
    // API logic to upload audio recording goes here
    setLoading(false);
  };

  return {
    conversations,
    activeConversation,
    loading,
    fetchConversations,
    uploadConversation,
  };
}
