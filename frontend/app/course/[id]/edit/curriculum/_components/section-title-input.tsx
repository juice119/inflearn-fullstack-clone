'use client';

import { Section } from '@/generated/openapi.ts';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useCurriculumContext } from '../_context/curriculum-context';
import { MAX_SECTION_TITLE_LENGTH } from '../_lib/curriculum-utils';

type SectionTitleInputProps = {
  section: Section;
};

export function SectionTitleInput({ section }: SectionTitleInputProps) {
  const { updateSectionTitle, isUpdatingSection } = useCurriculumContext();
  const [title, setTitle] = useState(section.title);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setTitle(section.title);
  }, [section.id, section.title]);

  const handleBlur = () => {
    setIsFocused(false);

    const trimmedTitle = title.trim();

    if (trimmedTitle === section.title.trim()) {
      return;
    }

    updateSectionTitle(section.id, trimmedTitle);
  };

  const showPlaceholder = !title && !isFocused;

  return (
    <div className="relative w-full py-1">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value.slice(0, MAX_SECTION_TITLE_LENGTH))}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        maxLength={MAX_SECTION_TITLE_LENGTH}
        disabled={isUpdatingSection}
        aria-label="섹션 제목"
        className={cn(
          'w-full border-0 bg-transparent px-0 py-0 shadow-none outline-none ring-0',
          'text-[18px] font-bold leading-[1.44] text-[#212529]',
          'focus:outline-none focus:ring-0',
          'disabled:cursor-not-allowed disabled:text-[#ADB5BD]',
        )}
      />

      {showPlaceholder && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 inset-y-1 flex items-center truncate text-[18px] font-bold leading-[1.44] text-[#868E96]"
        >
          섹션 제목을 작성해주세요. (최대 200자)
        </div>
      )}
    </div>
  );
}
