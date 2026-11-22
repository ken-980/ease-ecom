import { ActionFunction, redirect } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../lib/axios-api';
export interface AdminLoginActionData {
  error: string;
}

export interface SignInResponse {
  username: string;
  message?: string;
}

export const signInAction: ActionFunction = async ({
  request,
}): Promise<AdminLoginActionData | Response> => {
  const formData = await request.formData();
  const rawUsername = formData.get('username');
  const rawPassword = formData.get('password');

  // 1. Narrow types from FormDataEntryValue (string | File | null) to string
  const username = typeof rawUsername === 'string' ? rawUsername.trim() : '';
  const password = typeof rawPassword === 'string' ? rawPassword : '';

  if (!username || !password) {
    return { error: 'Both username and password are required.' };
  }

  try {
    const { data } = await api.post<SignInResponse>('/admin/signin', {
      username,
      password,
    });

    if (!data?.username) {
      return { error: 'Unexpected server response. Please try again.' };
    }

    localStorage.setItem('uname', JSON.stringify(data.username));

    return redirect(`/admin/${encodeURIComponent(data.username)}/dashboard`);
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      const serverMessage = error.response?.data?.message;
      return {
        error:
          serverMessage ||
          'Invalid credentials or server error. Please try again.',
      };
    }

    return { error: 'An unexpected error occurred. Please try again.' };
  }
};