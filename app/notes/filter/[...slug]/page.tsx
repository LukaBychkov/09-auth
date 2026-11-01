import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    metadataBase: new URL('https://08-zustand-coral-two.vercel.app'),
    title: ` Category: ${slug[0]}`,
    description: `Notes filtered by category: ${slug[0]}`,
    openGraph: {
      title: `Category: ${slug[0]}`,
      description: `Notes filtered by category: ${slug[0]}`,
      url: `/app/notes/filter/${slug[0]}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Category: ${slug[0]}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Category: ${slug[0]}`,
      description: `Notes filtered by category: ${slug[0]}`,
      images: ['https://ac.goit.global/fullstack/react/og-meta.jpg'],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const category = slug[0] === 'all' ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, tag: category }],
    queryFn: () => fetchNotes({ search: '', page: 1, perPage: 12, tag: category }),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient category={category} />
      </HydrationBoundary>
    </>
  );
}
