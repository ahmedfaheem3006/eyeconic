// api/auth.ts
import api from './api';

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