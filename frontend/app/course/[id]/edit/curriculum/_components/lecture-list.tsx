'use client';

import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';
import { ItemGroup } from '@/components/ui/item';
import { Lecture } from '@/generated/openapi.ts';
import { LectureCard } from './lecture-card';

type LectureListProps = {
  sectionLectures: Lecture[];
};

export function LectureList({ sectionLectures }: LectureListProps) {
  if (sectionLectures.length === 0) {
    return (
      <Empty className="min-h-[148px] gap-0 rounded-md border border-dashed border-[#DEE2E6] bg-white p-0 py-10">
        <EmptyHeader>
          <EmptyDescription className="text-[15px] leading-normal text-[#868E96]">
            수업을 추가해 주세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ItemGroup className="gap-2">
      {sectionLectures.map((lecture, lectureIndex) => (
        <LectureCard key={lecture.id} lecture={lecture} index={lectureIndex} />
      ))}
    </ItemGroup>
  );
}
