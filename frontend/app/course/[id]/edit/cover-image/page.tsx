import { getCourseById } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditCoverImageUI from './ui';

export default async function EditCoverImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: course, error } = await getCourseById(id);

  if (!course || error) {
    notFound();
  }

  return <EditCoverImageUI course={course} />;
}
