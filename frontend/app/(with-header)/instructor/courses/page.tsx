import { getAllInstructorCourses } from '@/lib/api';
import UI from './ui';

export default async function InstructorCoursesPage() {
  const { data: courses } = await getAllInstructorCourses();

  return <UI courses={courses ?? []}></UI>;
}
