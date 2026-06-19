import { getCourseById } from '@/lib/api';
import { notFound } from 'next/navigation';
import DescriptionBuilderUI from './ui';

export default async function DescriptionBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <DescriptionBuilderUI course={course.data} />;
}
