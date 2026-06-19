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
      <div className="grid min-h-screen grid-cols-[minmax(187px,calc(50%-392px))_704px_auto] px-12 pb-40 pt-8 gap-10 max-w-[1440px] my-0 mx-auto">
        <EditCourseSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
