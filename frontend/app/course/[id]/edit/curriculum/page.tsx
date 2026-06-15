import { getCourseById } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditCurriculumUI from './ui';

export default async function EditCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id, 'sections,lectures');

  if (!course.data || course.error) {
    return notFound();
  }

  return <EditCurriculumUI initialCourse={course.data} />;
}
