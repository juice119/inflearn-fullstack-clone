'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const creationItems = [
  {
    label: '강의 정보',
    segment: 'course_info',
    legacySegments: ['course_info'],
  },
  {
    label: '커리큘럼',
    segment: 'curriculum',
  },
  {
    label: '상세소개',
    segment: 'description-builder',
    description: '200자 이상 작성',
  },
  {
    label: '커버 이미지',
    segment: 'cover-image',
  },
] as const;

function isItemActive(pathname: string, courseId: string, item: (typeof creationItems)[number]) {
  const href = `/course/${courseId}/edit/${item.segment}`;

  if (pathname === href || pathname.startsWith(`${href}/`)) {
    return true;
  }

  if ('legacySegments' in item && item.legacySegments) {
    return item.legacySegments.some((segment) => {
      const legacyHref = `/course/${courseId}/edit/${segment}`;
      return pathname === legacyHref || pathname.startsWith(`${legacyHref}/`);
    });
  }

  return false;
}

function StepCircle({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full',
        isActive ? 'bg-[#212529] text-white' : 'bg-[#CED4DA] text-white',
      )}
    >
      <Check className="size-3" strokeWidth={3} />
    </span>
  );
}

export default function EditCourseSidebar() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();

  return (
    <aside className="w-[168px] shrink-0 self-start">
      <h2 className="mb-5 text-[15px] font-bold text-[#212529]">강의 제작</h2>

      <nav aria-label="강의 제작">
        <ul className="flex flex-col">
          {creationItems.map((item, index) => {
            const href = `/course/${id}/edit/${item.segment}`;
            const isActive = isItemActive(pathname, id, item);
            const isLast = index === creationItems.length - 1;

            return (
              <li key={item.segment} className="relative flex gap-2.5">
                <div className="flex flex-col items-center">
                  <StepCircle isActive={isActive} />
                  {!isLast && (
                    <span aria-hidden className="my-1 w-px flex-1 min-h-7 bg-[#DEE2E6]" />
                  )}
                </div>

                <Link
                  href={href}
                  className={cn(
                    'pt-0.5 transition-colors',
                    !isLast && 'pb-7',
                    isActive
                      ? 'font-semibold text-[#212529]'
                      : 'font-normal text-[#ADB5BD] hover:text-[#868E96]',
                  )}
                >
                  <span className="block text-[14px] leading-none">{item.label}</span>
                  {'description' in item && item.description && (
                    <span className="mt-1.5 block text-[12px] leading-none font-normal text-[#ADB5BD]">
                      {item.description}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
