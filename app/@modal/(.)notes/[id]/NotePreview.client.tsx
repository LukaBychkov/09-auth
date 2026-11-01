'use client';

import css from './NotePreview.module.css';
import Modal from '@/components/Modal/Modal';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotFound from '@/app/not-found';

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    retry: 1,
    refetchOnMount: false,
  });
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };
  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!note) return NotFound();

  return (
    <>
      <Modal onClose={handleClick}>
        <button className={css.backBtn} onClick={handleClick}>
          Back
        </button>
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
              </div>
              <p className={css.tag}>{note.tag}</p>
              <p className={css.content}>{note.content}</p>
              <p className={css.date}>{note.createdAt}</p>
            </div>
          </div>
        </main>
      </Modal>
    </>
  );
}
