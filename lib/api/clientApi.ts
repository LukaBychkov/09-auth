import { Note } from '@/types/note';
import { axiosInstance } from './api';
import { User } from '@/types/user';

export type NoteId = Note['id'];

export interface fetchParams {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
  sortBy?: string;
}
export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (fetchParams: fetchParams): Promise<NotesHttpResponse> => {
  const response = await axiosInstance.get<NotesHttpResponse>('/notes', {
    params: fetchParams,
  });
  return response.data;
};

export type CreateNoteParams = Pick<Note, 'title' | 'content' | 'tag'>;

export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const response = await axiosInstance.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: NoteId): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};

export interface RegisterRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await axiosInstance.post<User>('/auth/register', data);
  return res.data;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await axiosInstance.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await axiosInstance.get<User | ''>('/auth/session');
  return data || null;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const { data } = await axiosInstance.get<User>('/users/me');
  return data;
};

export interface UpdateMeParams {
  username: string;
}

export const updateMe = async (body: UpdateMeParams): Promise<User> => {
  const { data } = await axiosInstance.patch<User>('/users/me', body);
  return data;
};
