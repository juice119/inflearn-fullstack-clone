'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useCurriculumContext } from '../_context/curriculum-context';

export function SectionToolbar() {
  const {
    sections,
    guideBarIndex,
    addSection,
    moveGuideBarUp,
    moveGuideBarDown,
    requestDeleteSectionAboveGuideBar,
    isDeletingSection,
    isAddingSection,
  } = useCurriculumContext();

  const canMoveUp = guideBarIndex !== null && guideBarIndex > 0;
  const canMoveDown = guideBarIndex !== null && guideBarIndex < sections.length - 1;

  return (
    <div className="flex items-center justify-center">
      <Card className="rounded-full py-1.5 shadow-sm ring-border">
        <ButtonGroup className="px-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={addSection}
            disabled={isAddingSection}
          >
            <Plus className="size-4" />
            섹션 추가
          </Button>
          <ButtonGroupSeparator />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={moveGuideBarUp}
                disabled={!canMoveUp}
              >
                <ChevronUp className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>위 섹션으로 이동</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={moveGuideBarDown}
                disabled={!canMoveDown}
              >
                <ChevronDown className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>아래 섹션으로 이동</TooltipContent>
          </Tooltip>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            onClick={requestDeleteSectionAboveGuideBar}
            disabled={isDeletingSection}
          >
            <Trash2 className="size-4" />
          </Button>
        </ButtonGroup>
      </Card>
    </div>
  );
}
