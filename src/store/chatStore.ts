import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendChatMessage } from '@/services/dashboard/chat/chatService';
import { getOrCreateDeviceId } from '@/services/dashboard/devices/deviceService';
import { isShortcutCommand, handleShortcutCommand } from '@/store/shortcutStore';

export interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp?: string | Date;
}

interface ChatState {
  messages: Message[];
  streamingMessage: string | null; // Current streaming message text
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Message) => void;
  addUserMessage: (text: string) => void;
  addBotMessage: (text: string) => void;
  updateStreamingMessage: (text: string) => void;
  finalizeStreamingMessage: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      streamingMessage: null,
      isLoading: false,
      error: null,

      addMessage: (message: Message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, timestamp: new Date().toISOString() }],
        })),

      addUserMessage: (text: string) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { role: 'user', text, timestamp: new Date().toISOString() },
          ],
        })),

      addBotMessage: (text: string) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { role: 'bot', text, timestamp: new Date().toISOString() },
          ],
        })),

      updateStreamingMessage: (text: string) =>
        set({ streamingMessage: text }),

      finalizeStreamingMessage: () =>
        set((state) => {
          if (state.streamingMessage !== null) {
            const newMessages = [
              ...state.messages,
              { 
                role: 'bot' as const, 
                text: state.streamingMessage, 
                timestamp: new Date().toISOString() 
              },
            ];
            return { 
              messages: newMessages, 
              streamingMessage: null 
            };
          }
          return { streamingMessage: null };
        }),

      sendMessage: async (text: string) => {
        if (!text.trim()) return;

        const userMessage = text.trim();
        
        // Check if it's a shortcut command
        if (isShortcutCommand(userMessage)) {
          get().addUserMessage(userMessage);
          const result = handleShortcutCommand(userMessage);
          get().addBotMessage(result.message || 'Command executed.');
          return;
        }

        set({ isLoading: true, error: null, streamingMessage: '' });
        
        // Add user message immediately
        get().addUserMessage(userMessage);

        try {
          // Get device ID from localStorage
          const deviceId = getOrCreateDeviceId();
          
          // Accumulate the full response
          let fullResponse = '';
          // Send message with streaming
          await sendChatMessage(
            userMessage,
            deviceId,
            // onChunk callback - called for each chunk
            (chunk: string) => {
              fullResponse += chunk;
              get().updateStreamingMessage(fullResponse);
            },
            // onError callback
            (error: Error) => {
              const errorMessage = error.message || 'Failed to get response. Please try again.';
              get().updateStreamingMessage(`Error: ${errorMessage}`);
              set({ error: errorMessage, isLoading: false });
              // Finalize error message
              get().finalizeStreamingMessage();
            }
          );

          // Finalize the streaming message when complete
          get().finalizeStreamingMessage();
        } catch (error: any) {
          const errorMessage = error?.message || 'Failed to get response. Please try again.';
          get().updateStreamingMessage(`Error: ${errorMessage}`);
          set({ error: errorMessage });
          // Finalize error message
          get().finalizeStreamingMessage();
        } finally {
          set({ isLoading: false });
        }
      },

      clearMessages: () => set({ messages: [], error: null }),

      setMessages: (messages: Message[]) => set({ messages }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'chat-storage',
      // Only persist messages, not loading/error/streaming states
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
);

