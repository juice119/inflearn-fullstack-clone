'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@/generated/openapi.ts';
import { updateCourse } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

enum Level {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

type FormValues = {
  title: string;
  shortDescription: string;
  price: string;
  discountPrice?: string;
  level: Level;
  status: Status;
};

export default function EditCourseInfoUI({ course }: { course: Course }) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: course.title,
      shortDescription: course.shortDescription || '',
      price: (course.price || 0).toString(),
      discountPrice: course.discountPrice?.toString() || '',
      level: course.level as Level,
      status: course.status as Status,
    },
  });

  const { control, handleSubmit } = form;

  const updateCourseMutation = useMutation({
    mutationFn: (data: FormValues) =>
      updateCourse(course.id, {
        ...data,
        price: Number(data.price),
        discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      }),
    onSuccess: () => {
      toast.success('강의 정보가 수정되었습니다.');
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((data: FormValues) => updateCourseMutation.mutate(data))}
        className="space-y-8 bg-white p-8 rounded-lg shadow"
      >
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                강의 제목 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="강의 제목을 입력하세요" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                강의 두줄 요약 <span className="text-red-500">*</span>
              </FormLabel>
              <div className="text-xs text-red-500 mb-1">
                강의소개 상단에 보여집니다. 잠재 수강생들이 매력을 느낄만한 글을 짧게 남겨주세요.
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="ex) 이 강의를 통해 수강생은 컴퓨터 공학의 기초를 다질 수 있을 것으로 예상합니다."
                  required
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                강의 가격 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" min={0} placeholder="0" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>강의 할인 가격</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="할인 가격이 있다면 입력하세요"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                난이도 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="BEGINNER" id="level-beginner" />
                  <FormLabel htmlFor="level-beginner" className="mr-4">
                    입문
                  </FormLabel>
                  <RadioGroupItem value="INTERMEDIATE" id="level-intermediate" />
                  <FormLabel htmlFor="level-intermediate" className="mr-4">
                    초급
                  </FormLabel>
                  <RadioGroupItem value="ADVANCED" id="level-advanced" />
                  <FormLabel htmlFor="level-advanced">중급</FormLabel>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                상태 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="PUBLISHED" id="status-published" />
                  <FormLabel htmlFor="status-published" className="mr-4">
                    공개
                  </FormLabel>
                  <RadioGroupItem value="DRAFT" id="status-draft" />
                  <FormLabel htmlFor="status-draft">임시저장</FormLabel>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4">
          저장하기
        </Button>
      </form>
    </Form>
  );
}
