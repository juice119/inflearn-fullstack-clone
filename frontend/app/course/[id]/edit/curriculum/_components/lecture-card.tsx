'use client';

import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Lecture } from '@/generated/openapi.ts';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useCurriculumContext } from '../_context/curriculum-context';

type LectureCardProps = {
  lecture: Lecture;
  index: number;
};

export function LectureCard({ lecture, index }: LectureCardProps) {
  const {
    requestDeleteLecture,
    isDeletingLecture,
    lecture: { setEditLecture, setIsEditLectureDialogOpen: setEditLectureDialogOpen },
  } = useCurriculumContext();

  return (
    <Item variant="outline" size="sm">
      <ItemMedia variant="icon">
        <GripVertical className="size-4 cursor-grab text-muted-foreground" />
      </ItemMedia>
      <ItemContent className="flex-row items-center gap-3">
        <span className="w-4 shrink-0 text-[13px] font-medium text-muted-foreground">
          {index + 1}
        </span>
        <ItemTitle className="truncate">{lecture.title}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditLecture(lecture);
                setEditLectureDialogOpen(true);
              }}
            >
              <Pencil className="size-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              onClick={() => requestDeleteLecture(lecture.id)}
              disabled={isDeletingLecture}
            >
              <Trash2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>수업 삭제</TooltipContent>
        </Tooltip>
      </ItemActions>
    </Item>
  );
}
