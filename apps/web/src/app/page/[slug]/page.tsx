import { notFound } from 'next/navigation';
import { API_INTERNAL_BASE } from '@/lib/api';

interface CustomPage { id: number; title: string; slug: string; content?: string | null }

async function getPage(slug: string): Promise<CustomPage | null> {
  const res = await fetch(`${API_INTERNAL_BASE}/pages/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  return { title: page?.title ?? 'Page not found' };
}

export default async function CustomPageView({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) notFound();

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">{page.title}</h1>
      <div
        className="rich-text mt-8"
        dangerouslySetInnerHTML={{ __html: page.content ?? '' }}
      />
    </div>
  );
}
