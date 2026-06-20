'use client';

import { Course } from '@/generated/openapi.ts';
import { updateCourse, uploadMediaFile } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Loader2, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

// 커버 이미지 최대 5MB이하
const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_FORMATS: Accept = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
};

const PREVIEW_COURSE_TITLE = '테스트용 강의';
const PREVIEW_INSTRUCTOR_NAME = '주스';

export default function EditCoverImageUI({ course }: { course: Course }) {
  const queryClient = useQueryClient();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(course.thumbnailUrl ?? null);
  const updateCoverImageMutation = useMutation({
    mutationFn: async (coverImage: File) => {
      const { data: uploadData, error: uploadError } = await uploadMediaFile(coverImage);

      if (uploadError || !uploadData) {
        throw new Error(uploadError?.message ?? '커버 이미지 업로드를 실패하였습니다.');
      }

      const coverImageUrl = uploadData.fileUrl;
      const { data, error } = await updateCourse(course.id, { thumbnailUrl: coverImageUrl });
      if (error || !data) {
        throw new Error(error?.message ?? '커버 이미지 업데이트를 실패하였습니다.');
      }
      return data;
    },
    onSuccess: (data) => {
      setCoverImageUrl(data.thumbnailUrl ?? null);
      toast.success('커버 이미지가 업데이트를 완료하였습니다.');
      void queryClient.invalidateQueries({ queryKey: ['course', course.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || '커버 이미지 업데이트 중 문제가 발생하였습니다.');
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        updateCoverImageMutation.mutate(file);
      }
    },
    [updateCoverImageMutation],
  );

  const isUploading = updateCoverImageMutation.isPending;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_IMAGE_FORMATS,
    maxSize: MAX_COVER_IMAGE_SIZE,
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#DEE2E6] bg-white">
      {/* 제목 */}
      <div className="px-6 py-5">
        <h1 className="text-2xl font-bold">커버 이미지</h1>
      </div>

      {/* 커버 이미지 수정 영역 */}
      <div className="w-full bg-[#E9ECEF] px-6 py-5">
        <div className="mx-auto flex w-full max-w-[300px] flex-col">
          <span className="text-[13px] font-medium text-[#868E96]">
            ✦ 리스트에서 미리 보여질 이미지에요
          </span>

          {/* 강의 카드*/}
          <div className="w-full max-w-[20rem] overflow-hidden rounded-lg bg-white p-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col gap-2.5">
            {/* 커버 이미지 업로드 영역 */}
            <div
              {...getRootProps()}
              className={cn(
                'w-full flex cursor-pointer flex-col items-center justify-center text-center transition-colors rounded-lg border',
                coverImageUrl
                  ? 'overflow-hidden border-none'
                  : 'aspect-1200/781 border-dashed border-[#CED4DA] bg-[#F8F9FA]',
                isDragActive && 'border-[#00C471] bg-[#F8FFF9]',
                isUploading && 'pointer-events-none opacity-60',
              )}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <Loader2 className="mb-2 size-9 animate-spin text-[#CED4DA]" />
                  <p className="text-[13px] font-medium">업로드 중...</p>
                </div>
              ) : coverImageUrl ? (
                <div className="group relative w-full rounded-lg">
                  <Image
                    src={coverImageUrl ?? 'https://cdn.inflearn.com/public/course/preview.png'}
                    alt="커버 이미지"
                    className="aspect-1200/781 w-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-white/90 group-hover:opacity-100">
                    <div className="flex items-center justify-center font-bold text-black">
                      클릭하여 이미지 변경
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <ImagePlus className="mb-2 size-9 text-[#212529]" strokeWidth={1.5} />
                  <p className="text-[14px] font-semibold text-[#212529]">커버 이미지 업로드</p>
                  <p className="mt-1 text-[12px] text-[#868E96]">1200 x 781 / 2.5MB 이하</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="">{PREVIEW_COURSE_TITLE}</div>
              <div className="text-[0.875rem] text-[#868E96]">{PREVIEW_INSTRUCTOR_NAME}</div>
              <div className="flex items-center gap-2.5 pt-1.5 text-[0.75rem] text-[#868E96]">
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-[#FFC400] text-[#FFC400]" />
                  <span className="">4.9</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="size-3" />
                  <span>100+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
