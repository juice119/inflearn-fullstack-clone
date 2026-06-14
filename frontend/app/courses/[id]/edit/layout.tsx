import * as api from '@/lib/api';
import { notFound } from 'next/navigation';
import EditCourseHeader from './_components/edit-course-header';
import EditCourseSidebar from './_components/edit-course-sidebar';

export default async function EditCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (course.error || !course.data) {
    notFound();
  }

  return (
    <div className="w-full h-full bg-[#F1F3F5]">
      <EditCourseHeader courseId={id} title={course.data.title} status={course.data.status} />
      <div className="flex min-h-screen gap-12 p-12">
        <EditCourseSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
