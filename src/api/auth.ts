// api/auth.ts
import api from './api';


export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export const sendChatMessage = async (prompt: string): Promise<string> => {
  try {
    const response = await api.post('/chat/', { prompt });
    return response.data.response || response.data.message || response.data.content;
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to send message. Please try again.');
  }
};

export const sendChatMessageWithImage = async (prompt: string, imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('image', imageFile);

    const response = await api.post('/chat/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.response || response.data.message || response.data.content;
  } catch (error: any) {
    console.error('Error sending chat message with image:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to send message with image. Please try again.');
  }
};

// Add other functions as before...
export const getChatHistory = async (): Promise<any[]> => {
  try {
    const response = await api.get('/chat-history/');
    return response.data.results || response.data || [];
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const deleteChatSession = async (chatId: string): Promise<void> => {
  try {
    await api.delete(`/chat/${chatId}/delete/`);
  } catch (error: any) {
    console.error('Error deleting chat session:', error);
    if (error.response?.status === 404) {
      return;
    }
    throw new Error('Failed to delete chat session. Please try again.');
  }
};

export const transcribeAudio = async (audioFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/transcribe-audio/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.transcription || response.data.text || '';
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

// Stream chat function for real-time responses (optional)
export const streamChatMessage = async (
  prompt: string, 
  onData: (data: string) => void,
  onError: (error: Error) => void,
  onComplete: () => void
) => {
  try {
    const response = await fetch(`${api.defaults.baseURL}/chat-stream/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            onData(parsed.content || parsed.message || '');
          } catch (e) {
            console.warn('Failed to parse streaming data:', data);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Error streaming chat message:', error);
    onError(new Error('Failed to stream message. Please try again.'));
  }
};




export const loginRequest = async (username: string, password: string) => {
  try {
    const response = await api.post('/users/login/', { username, password });
    
    // إذا كان الباك اند يرسل معلومات المستخدم مع الـ tokens
    if (response.data.user) {
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user
      };
    }
    
    // إذا كان الباك اند يرسل الـ tokens فقط، نحتاج لجلب معلومات المستخدم
    const userResponse = await api.get('/users/profile/', {
      headers: {
        Authorization: `Bearer ${response.data.access}`
      }
    });
    
    return {
      access: response.data.access,
      refresh: response.data.refresh,
      user: userResponse.data
    };
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const registerRequest = async (username: string, email: string, password: string, firstName: string = '', lastName: string = '') => {
  try {
    const response = await api.post('/users/register/', {
      username,
      email,
      password1: password,
      password2: password,
      first_name: firstName,
      last_name: lastName
    });
    
    return response.data;
  } catch (error) {
    console.error('Register request failed:', error);
    throw error;
  }
};

export const logoutRequest = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    const response = await api.post('/users/logout/', { refresh });
    return response.data;
  } catch (error) {
    console.error('Logout request failed:', error);
    throw error;
  }
};

// دالة لجلب معلومات المستخدم الحالي
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile/');
    return response.data;
  } catch (error) {
    console.error('Get user profile failed:', error);
    throw error;
  }
};