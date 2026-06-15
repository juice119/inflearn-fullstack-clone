'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Section } from '@/generated/openapi.ts';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useCurriculumContext } from '../_context/curriculum-context';
import { getSectionLectures } from '../_lib/curriculum-utils';
import { LectureList } from './lecture-list';
import { SectionTitleInput } from './section-title-input';

type SectionCardProps = {
  section: Section;
  index: number;
};

function SectionHeader({ section, index }: { section: Section; index: number }) {
  return (
    <div className="px-5 pt-5 pb-4">
      <div className="space-y-1.5">
        <p className="text-[13px] font-bold leading-none text-[#00C471]">섹션 {index + 1}</p>
        <SectionTitleInput section={section} />
      </div>
    </div>
  );
}

function AddLectureButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#F1F3F5] px-4 text-[14px] font-semibold text-[#212529] transition-colors',
        'hover:bg-[#E9ECEF] disabled:pointer-events-none disabled:opacity-50',
      )}
    >
      <span
        aria-hidden
        className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#343A40]"
      >
        <Plus className="size-[10px] text-white" strokeWidth={3} />
      </span>
      <span className="leading-none">수업 추가</span>
    </button>
  );
}

export function SectionCard({ section, index }: SectionCardProps) {
  const { lectures, openAddLecture, isAddingLecture } = useCurriculumContext();
  const sectionLectures = getSectionLectures(section, lectures);

  return (
    <Card className="overflow-hidden py-0">
      <div className="flex">
        <div className="w-1 shrink-0 bg-[#00C471]" aria-hidden />
        <div className="min-w-0 flex-1">
          <SectionHeader section={section} index={index} />

          <CardContent className="px-5 pb-5 pt-0">
            <LectureList sectionLectures={sectionLectures} />
          </CardContent>

          <CardFooter className="justify-center px-5 pb-5 pt-0">
            <AddLectureButton onClick={() => openAddLecture(section)} disabled={isAddingLecture} />
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
