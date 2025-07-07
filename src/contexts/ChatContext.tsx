import React, { createContext, useContext, useState } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

interface ChatContextType {
  currentSession: ChatSession | null;
  chatHistory: ChatSession[];
  isOpen: boolean;
  isWidgetOpen: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  openWidget: () => void;
  closeWidget: () => void;
  sendMessage: (message: string) => Promise<void>;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => {
    setIsOpen(true);
    setIsWidgetOpen(false); // Close widget when opening full chat
    if (!currentSession) {
      createNewSession();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const openWidget = () => {
    setIsWidgetOpen(true);
    setIsOpen(false); // Close full chat when opening widget
    if (!currentSession) {
      createNewSession();
    }
  };

  const closeWidget = () => {
    setIsWidgetOpen(false);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setCurrentSession(newSession);
  };

  const sendMessage = async (message: string) => {
    if (!currentSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    // Update current session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      title: currentSession.messages.length === 0 ? message.slice(0, 30) + '...' : currentSession.title
    };
    setCurrentSession(updatedSession);

    setIsLoading(true);

    // Simulate API call to your chatbot backend
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock bot response - replace with actual API call
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for your message: "${message}". This is a mock response from the Eyeconic chatbot. I'm here to help you with any questions about our AR glasses!`,
        isUser: false,
        timestamp: new Date()
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage]
      };

      setCurrentSession(finalSession);

      // Update chat history
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(session => session.id === finalSession.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = finalSession;
          return updated;
        } else {
          return [finalSession, ...prev];
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const deleteSession = (sessionId: string) => {
    setChatHistory(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  return (
    <ChatContext.Provider value={{
      currentSession,
      chatHistory,
      isOpen,
      isWidgetOpen,
      isLoading,
      openChat,
      closeChat,
      openWidget,
      closeWidget,
      sendMessage,
      createNewSession,
      loadSession,
      deleteSession
    }}>
      {children}
    </ChatContext.Provider>
  );
};