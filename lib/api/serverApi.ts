import { cookies } from 'next/headers';
import { axiosInstance } from './api';
import { NoteId, type NotesHttpResponse, type fetchParams } from './clientApi';
import { Note } from '@/types/note';
import { User } from '@/types/user';

export const fetchNotes = async (fetchParams: fetchParams): Promise<NotesHttpResponse> => {
  const cookieStore = await cookies();
  const res = await axiosInstance.get<NotesHttpResponse>('/notes', {
    params: fetchParams,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  const cookieStore = await cookies();
  const res = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await axiosInstance.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};

export const getMe = async () => {
  const cookieStore = await cookies();
  const { data } = await axiosInstance.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
