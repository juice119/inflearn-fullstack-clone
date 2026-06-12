import InstructorPageName from './_components/instructor-page-name';
import InstructorPageSidebar from './_components/instructor-page-sidebar';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <InstructorPageName />
      <div className="flex w-6xl mx-auto">
        <InstructorPageSidebar />
        {children}
      </div>
    </div>
  );
}
