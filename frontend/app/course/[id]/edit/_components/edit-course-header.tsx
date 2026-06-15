'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '공개중',
};

type EditCourseHeaderProps = {
  courseId: string;
  title: string;
  status: string;
};

export default function EditCourseHeader({ courseId, title, status }: EditCourseHeaderProps) {
  const statusLabel = STATUS_LABEL[status] ?? status;

  const handleSubmit = () => {
    toast.info('제출 기능은 준비 중입니다.');
  };

  return (
    <header className="flex items-center justify-between border-b border-[#DEE2E6] bg-white px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-xl font-bold text-[#212529]">{title}</h1>
        <Badge className="shrink-0 rounded-md bg-[#212529] px-2.5 text-xs font-medium text-white hover:bg-[#212529]">
          {statusLabel}
        </Badge>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* TODO: 강의 보기 클릭 시 저장하지 않고 이동하면 수정사항 미저장 알림 표시 */}
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}/detail`}>강의 보기</Link>
        </Button>
        <Button className="bg-[#CED4DA] text-white hover:bg-[#CED4DA]/90" onClick={handleSubmit}>
          제출
        </Button>
      </div>
    </header>
  );
}
