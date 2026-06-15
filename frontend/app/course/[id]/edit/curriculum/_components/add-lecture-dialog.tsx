'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, useEffect, useState } from 'react';
import { useCurriculumContext } from '../_context/curriculum-context';
import { MAX_LECTURE_TITLE_LENGTH } from '../_lib/curriculum-utils';

export function AddLectureDialog() {
  const { addLectureSection, submitAddLecture, closeAddLectureDialog, isAddingLecture } =
    useCurriculumContext();
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (addLectureSection) {
      setTitle('');
    }
  }, [addLectureSection]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitAddLecture(title);
  };

  return (
    <Dialog
      open={addLectureSection !== null}
      onOpenChange={(open) => {
        if (!open) closeAddLectureDialog();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">수업 추가</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="lecture-title">수업 추가 제목</Label>
            <Input
              id="lecture-title"
              value={title}
              onChange={(event) => setTitle(event.target.value.slice(0, MAX_LECTURE_TITLE_LENGTH))}
              placeholder="제목을 입력해주세요. (최대 200자)"
              maxLength={MAX_LECTURE_TITLE_LENGTH}
              autoFocus
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={closeAddLectureDialog}>
              취소
            </Button>
            <Button type="submit" disabled={isAddingLecture || !title.trim()}>
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
