// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  sendChatMessage,
  sendChatMessageWithImage,
  getChatHistory,
  deleteChatSession,
  transcribeAudio as transcribeAudioAPI,
} from "../api/auth";
import { useAuth } from "./AuthContext";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
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
  sendMessageWithImage: (message: string, image: File) => Promise<void>;
  transcribeAudio: (audioFile: File) => Promise<string>;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  loadChatHistory: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadChatHistory();
    }
  }, [isAuthenticated]);

  const openChat = () => {
    setIsOpen(true);
    setIsWidgetOpen(false);
    if (!currentSession) {
      createNewSession();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const openWidget = () => {
    setIsWidgetOpen(true);
    setIsOpen(false);
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
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setCurrentSession(newSession);
  };

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      const transformedHistory: ChatSession[] = history.map((chat) => ({
        id: chat.id.toString(),
        title: chat.title || "Chat Session",
        messages:
          chat.messages?.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.content || msg.text,
            isUser: msg.role === "user",
            timestamp: new Date(msg.timestamp),
            image: msg.image || undefined,
          })) || [],
        createdAt: new Date(chat.created_at),
      }));
      setChatHistory(transformedHistory);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const cleanAndValidateResponse = (response: string): string => {
    // Check if response is corrupted or contains too many non-standard characters
    const corruptedPatterns = [
      /[^\u0000-\u007F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\n\r\t]{10,}/, // Too many non-standard characters
      /#{5,}/, // Too many hash symbols
      /\*{5,}/, // Too many asterisks
      /[A-Za-z]{50,}/, // Suspiciously long words
      /\d{20,}/, // Suspiciously long numbers
    ];

    // Check if response seems corrupted
    const isCorrupted = corruptedPatterns.some((pattern) =>
      pattern.test(response)
    );

    if (isCorrupted || response.length < 10) {
      return "I apologize, but I encountered an issue generating a proper response. Could you please rephrase your question or try again?";
    }

    // Clean the response
    return response
      .replace(
        /[^\u0000-\u007F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\n\r\t*#.-]/g,
        ""
      ) // Remove invalid characters
      .replace(/#{4,}/g, "###") // Limit hash symbols
      .replace(/\*{4,}/g, "**") // Limit asterisks
      .replace(/\s{4,}/g, " ") // Limit spaces
      .replace(/\n{4,}/g, "\n\n") // Limit newlines
      .trim();
  };
  

  const sendMessage = async (message: string) => {
    if (!currentSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      title:
        currentSession.messages.length === 0
          ? message.slice(0, 30) + "..."
          : currentSession.title,
    };
    setCurrentSession(updatedSession);

    setIsLoading(true);

    try {
      const rawBotResponse = await sendChatMessage(message);
      const cleanedResponse = cleanAndValidateResponse(rawBotResponse);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: cleanedResponse,
        isUser: false,
        timestamp: new Date(),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
      };

      setCurrentSession(finalSession);

      setChatHistory((prev) => {
        const existingIndex = prev.findIndex(
          (session) => session.id === finalSession.id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = finalSession;
          return updated;
        } else {
          return [finalSession, ...prev];
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error while processing your message. Please try again with a different question.",
        isUser: false,
        timestamp: new Date(),
      };

      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
      };

      setCurrentSession(errorSession);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageWithImage = async (message: string, image: File) => {
    if (!currentSession) return;

    const imagePreview = URL.createObjectURL(image);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
      image: imagePreview,
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      title:
        currentSession.messages.length === 0
          ? (message || "Image message").slice(0, 30) + "..."
          : currentSession.title,
    };
    setCurrentSession(updatedSession);

    setIsLoading(true);

    try {
      const botResponse = await sendChatMessageWithImage(message, image);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
      };

      setCurrentSession(finalSession);

      setChatHistory((prev) => {
        const existingIndex = prev.findIndex(
          (session) => session.id === finalSession.id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = finalSession;
          return updated;
        } else {
          return [finalSession, ...prev];
        }
      });
    } catch (error) {
      console.error("Error sending message with image:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while processing your image. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
      };

      setCurrentSession(errorSession);
    } finally {
      setIsLoading(false);
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Fix the transcribeAudio function
  const transcribeAudio = async (audioFile: File): Promise<string> => {
    try {
      const transcription = await transcribeAudioAPI(audioFile);
      return transcription;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Failed to transcribe audio. Please try again.");
    }
  };

  const loadSession = (sessionId: string) => {
    const session = chatHistory.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      setChatHistory((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setChatHistory((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      currentSession?.messages.forEach((message) => {
        if (message.image && message.image.startsWith("blob:")) {
          URL.revokeObjectURL(message.image);
        }
      });
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
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
        sendMessageWithImage,
        transcribeAudio,
        createNewSession,
        loadSession,
        deleteSession,
        loadChatHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
