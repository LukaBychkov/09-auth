import { Note } from '@/types/note';
import axios from 'axios';

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${myKey}`,
    Accept: 'application/json',
  },
});

type NoteId = Note['id'];

interface fetchParams {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
  sortBy?: string;
}
interface NotesHttpResponse {
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

export const createNote = async (note: Pick<Note, 'title' | 'content' | 'tag'>): Promise<Note> => {
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
