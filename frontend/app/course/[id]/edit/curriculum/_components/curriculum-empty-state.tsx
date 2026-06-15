'use client';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { Plus } from 'lucide-react';
import { useCurriculumContext } from '../_context/curriculum-context';

export function CurriculumEmptyState() {
  const { addSection, isAddingSection } = useCurriculumContext();

  return (
    <Empty className="border bg-card">
      <EmptyHeader>
        <EmptyTitle>섹션이 없습니다</EmptyTitle>
        <EmptyDescription>섹션을 추가해 주세요.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" variant="outline" onClick={addSection} disabled={isAddingSection}>
          <Plus className="size-4" />
          섹션 추가
        </Button>
      </EmptyContent>
    </Empty>
  );
}
