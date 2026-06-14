import { getCourseById } from '@/lib/api';
import { notFound } from 'next/navigation';
import UI from './ui';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course.data || course.error) {
    return notFound();
  }

  return (
    <div>
      <UI course={course.data} />
    </div>
  );
}
