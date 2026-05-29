import { create } from 'zustand';
import { Conversation, Task, MoodEntry } from '../types';

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  activeTranscript: string | null;
  activeAiResponse: string | null;
  activeTasks: Task[];
  activeMood: MoodEntry | null;
  
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setActiveTranscript: (transcript: string | null) => void;
  setActiveAiResponse: (aiResponse: string | null) => void;
  setActiveTasks: (tasks: Task[]) => void;
  setActiveMood: (mood: MoodEntry | null) => void;
  clearActiveSession: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversation: null,
  isLoading: false,
  activeTranscript: null,
  activeAiResponse: null,
  activeTasks: [],
  activeMood: null,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setActiveTranscript: (activeTranscript) => set({ activeTranscript }),
  setActiveAiResponse: (activeAiResponse) => set({ activeAiResponse }),
  setActiveTasks: (activeTasks) => set({ activeTasks }),
  setActiveMood: (activeMood) => set({ activeMood }),
  clearActiveSession: () =>
    set({
      activeTranscript: null,
      activeAiResponse: null,
      activeTasks: [],
      activeMood: null,
    }),
}));
