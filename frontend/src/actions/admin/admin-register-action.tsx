import { ActionFunction, redirect } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../lib/axios-api';
import type { AdminRegisterActionData } from '../../components/admin/auth/AdminRegister';

interface RegisterResponse {
  username: string;
  message?: string;
}

export const adminRegisterAction: ActionFunction = async ({
  request,
}): Promise<AdminRegisterActionData | Response> => {
  const formData = await request.formData();

  const rawUsername = formData.get('username');
  const rawPassword = formData.get('password');
  const rawPasswordConfirm = formData.get('passwordConfirm');

  // 1. Narrow FormDataEntryValue types safely
  const username = typeof rawUsername === 'string' ? rawUsername.trim() : '';
  const password = typeof rawPassword === 'string' ? rawPassword : '';
  const passwordConfirm =
    typeof rawPasswordConfirm === 'string' ? rawPasswordConfirm : '';

  // 2. Collect field-level validation errors before making an API request
  const fieldErrors: NonNullable<AdminRegisterActionData['fieldErrors']> = {};

  if (!username) {
    fieldErrors.username = 'Username is required.';
  } else if (username.length < 3) {
    fieldErrors.username = 'Username must be at least 3 characters.';
  }

  if (!password) {
    fieldErrors.password = 'Password is required.';
  } else if (password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters.';
  }

  if (!passwordConfirm) {
    fieldErrors.passwordConfirm = 'Please confirm your password.';
  } else if (password !== passwordConfirm) {
    fieldErrors.passwordConfirm = 'Passwords do not match.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // 3. Submit clean payload via shared Axios client
  try {
    const { data } = await api.post<RegisterResponse>('/admin/register', {
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
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      // Map 409 Conflict (e.g., duplicate username) directly to the username input
      if (status === 409) {
        return {
          fieldErrors: {
            username: serverMessage || 'That username is already taken.',
          },
        };
      }

      return {
        error:
          serverMessage || 'Registration failed. Please check your details.',
      };
    }

    return { error: 'An unexpected error occurred. Please try again.' };
  }
};