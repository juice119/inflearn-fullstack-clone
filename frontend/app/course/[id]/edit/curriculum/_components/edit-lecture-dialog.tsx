'use client';

import CKEditor from '@/components/ckeditor';
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
import { Lecture } from '@/generated/openapi.ts';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { MAX_LECTURE_TITLE_LENGTH } from '../_lib/curriculum-utils';

const MAX_VIDEO_SIZE = 300 * 1024 * 1024;
const ALLOWED_VIDEO_ACCEPT = {
  'video/mp4': ['.mp4'],
  'video/x-matroska': ['.mkv'],
  'video/quicktime': ['.mov'],
} as const;

const sectionLabelClass = 'text-[14px] font-semibold leading-none text-[#212529]';
const fieldBorderClass = 'border-[#DEE2E6]';

type EditLectureDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  lecture: Lecture;
};

export function EditLectureDialog({ isOpen, onClose, lecture }: EditLectureDialogProps) {
  const [title, setTitle] = useState(lecture.title);
  const [description, setDescription] = useState(lecture.description ?? '');

  useEffect(() => {
    setTitle(lecture.title);
    setDescription(lecture.description ?? '');
  }, [lecture]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ALLOWED_VIDEO_ACCEPT,
    maxSize: MAX_VIDEO_SIZE,
    maxFiles: 1,
    multiple: false,
    onDropAccepted: () => {},
    onDropRejected: () => {},
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: API 연동 후 실제 저장 로직으로 교체
    console.log('수업 편집 저장 (임시)', {
      lectureId: lecture.id,
      title,
      description,
    });
    toast.info('저장 기능은 준비 중입니다.');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex h-[90vh] w-[780px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 shadow-xl ring-0 sm:max-w-[780px]">
        <DialogHeader className="shrink-0 px-8 pt-8 pb-0">
          <DialogTitle className="text-[18px] font-bold leading-none text-[#212529]">
            수업 편집
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <form id="edit-lecture-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 수업 제목 */}
            <div className="space-y-2.5">
              <Label htmlFor="edit-lecture-title" className={sectionLabelClass}>
                수업 제목
              </Label>
              <Input
                id="edit-lecture-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value.slice(0, MAX_LECTURE_TITLE_LENGTH))
                }
                maxLength={MAX_LECTURE_TITLE_LENGTH}
                className={cn(
                  'h-10 rounded-lg bg-white px-3 text-[15px] text-[#212529] shadow-none',
                  fieldBorderClass,
                )}
              />
            </div>

            {/* 강의 영상 */}
            <div className="space-y-2.5">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Label className={sectionLabelClass}>강의 영상</Label>
                <span className="text-[13px] leading-normal text-[#868E96]">
                  최대 300MB (.mp4, .mkv, .mov만 가능)
                </span>
              </div>

              <div
                {...getRootProps()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-white px-6 py-10 text-center transition-colors',
                  fieldBorderClass,
                  isDragActive && 'border-[#00C471] bg-[#F8FFF9]',
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mb-4 size-8 text-[#ADB5BD]" />
                <p className="text-[15px] font-semibold text-[#212529]">영상 파일 선택</p>
                <p className="mt-1.5 text-[13px] text-[#868E96]">
                  업로드할 동영상 파일을 드래그 앤 드롭하세요
                </p>
              </div>
            </div>

            {/* 수업 노트 작성 */}
            <div className="space-y-2.5">
              <Label className={sectionLabelClass}>수업 노트 작성</Label>
              <div
                className={cn(
                  'overflow-hidden rounded-lg border bg-white',
                  fieldBorderClass,
                  '[&_.ck-editor-container>div]:rounded-none [&_.ck-editor-container>div]:border-0 [&_.ck-editor-container>div]:p-0',
                  '[&_.ck-content]:text-[14px] [&_.ck-content]:text-[#495057]',
                )}
              >
                {isOpen && (
                  <CKEditor key={lecture.id} value={description} onChange={setDescription} />
                )}
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className={cn('shrink-0 gap-2 border-t px-8 py-5', fieldBorderClass)}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={cn(
              'h-10 min-w-[72px] rounded-lg bg-white px-5 text-[14px] font-semibold text-[#212529] shadow-none hover:bg-[#F8F9FA]',
              fieldBorderClass,
            )}
          >
            취소
          </Button>
          <Button
            type="submit"
            form="edit-lecture-form"
            disabled={!title.trim()}
            className="h-10 min-w-[72px] rounded-lg border-0 bg-[#00C471] px-5 text-[14px] font-semibold text-white shadow-none hover:bg-[#00B068] disabled:bg-[#ADB5BD] disabled:text-white"
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
