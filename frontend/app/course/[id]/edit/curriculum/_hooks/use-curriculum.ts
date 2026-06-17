'use client';

import { Course, Lecture, Section } from '@/generated/openapi.ts';
import {
  createLecture,
  createSection,
  deleteLecture,
  deleteSection,
  getCourseById,
  updateSection,
} from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteTarget, getActiveLectures, getActiveSections } from '../_lib/curriculum-utils';

export function useCurriculum(initialCourse: Course) {
  const queryClient = useQueryClient();
  const [hasMounted, setHasMounted] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [addLectureSection, setAddLectureSection] = useState<Section | null>(null);
  const [guideBarIndex, setGuideBarIndex] = useState<number | null>(null);
  const [editLecture, setEditLecture] = useState<Lecture>();
  const [isEditLectureDialogOpen, setIsEditLectureDialogOpen] = useState(false);

  const courseQueryKey = useMemo(
    () => ['course', initialCourse.id, 'sections,lectures'] as const,
    [initialCourse.id],
  );

  const { data: queriedCourse } = useQuery<Course>({
    queryKey: courseQueryKey,
    queryFn: async () => {
      const { data, error } = await getCourseById(initialCourse.id, 'sections,lectures');

      if (error || !data) {
        throw new Error(error?.message ?? '강의 정보를 불러오지 못했습니다.');
      }

      return data;
    },
    enabled: hasMounted,
    staleTime: 30_000,
  });

  useEffect(() => {
    queryClient.setQueryData(courseQueryKey, initialCourse);
    setHasMounted(true);
  }, [courseQueryKey, initialCourse, queryClient]);

  const course = hasMounted ? (queriedCourse ?? initialCourse) : initialCourse;

  const sections = useMemo(() => getActiveSections(course?.sections), [course?.sections]);
  const lectures = useMemo(() => getActiveLectures(course?.lectures), [course?.lectures]);

  useEffect(() => {
    if (sections.length === 0) {
      setGuideBarIndex(null);
      return;
    }

    setGuideBarIndex((prev) => {
      if (prev === null) {
        return sections.length - 1;
      }

      return Math.min(prev, sections.length - 1);
    });
  }, [sections.length]);

  const invalidateCourse = async () => {
    await queryClient.invalidateQueries({ queryKey: courseQueryKey });
  };

  const addSectionMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await createSection(course.id, title);

      if (error) {
        toast.error(error.message);
        return;
      }

      return data;
    },
    onSuccess: async () => {
      await invalidateCourse();
      setGuideBarIndex(sections.length);
      toast.success('섹션이 추가되었습니다.');
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const { data, error } = await deleteSection(sectionId);

      if (error) {
        toast.error(error.message);
        return null;
      }

      return data;
    },
    onSuccess: async () => {
      await invalidateCourse();
      toast.success('섹션이 삭제되었습니다.');
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: async ({
      sectionId,
      title,
      description,
    }: {
      sectionId: string;
      title: string;
      description: string;
    }) => {
      const { data, error } = await updateSection(sectionId, {
        title,
        description,
      });

      if (error) {
        toast.error(error.message);
        return null;
      }

      return data;
    },
    onSuccess: async () => {
      await invalidateCourse();
    },
  });

  const addLectureMutation = useMutation({
    mutationFn: async ({ sectionId, title }: { sectionId: string; title: string }) => {
      const { data, error } = await createLecture(course.id, sectionId, {
        title,
        description: '',
      });

      if (error) {
        toast.error(error.message);
        return null;
      }

      return data;
    },
    onSuccess: async () => {
      await invalidateCourse();
      setAddLectureSection(null);
      toast.success('수업이 추가되었습니다.');
    },
  });

  const deleteLectureMutation = useMutation({
    mutationFn: async (lectureId: string) => {
      const { data, error } = await deleteLecture(lectureId);

      if (error) {
        toast.error(error.message);
        return null;
      }

      return data;
    },
    onSuccess: async () => {
      await invalidateCourse();
      toast.success('유닛이 삭제되었습니다.');
    },
  });

  const handleAddSection = () => {
    addSectionMutation.mutate('');
  };

  const handleMoveGuideBarUp = () => {
    setGuideBarIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const handleMoveGuideBarDown = () => {
    setGuideBarIndex((prev) => (prev !== null && prev < sections.length - 1 ? prev + 1 : prev));
  };

  const requestDeleteLecture = (lectureId: string) => {
    setDeleteTarget({ type: 'lecture', id: lectureId });
  };

  const requestDeleteSection = (sectionId: string) => {
    setDeleteTarget({ type: 'section', id: sectionId });
  };

  const requestDeleteSectionAboveGuideBar = () => {
    if (guideBarIndex === null) return;

    const section = sections[guideBarIndex];

    if (!section) return;

    requestDeleteSection(section.id);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const closeAddLectureDialog = () => {
    setAddLectureSection(null);
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    const section = sections.find((item) => item.id === sectionId);

    updateSectionMutation.mutate({
      sectionId,
      title,
      description: section?.description ?? '',
    });
  };

  const handleOpenAddLecture = (section: Section) => {
    setAddLectureSection(section);
  };

  const handleSubmitAddLecture = (title: string) => {
    if (!addLectureSection) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error('수업 제목을 입력해주세요.');
      return;
    }

    addLectureMutation.mutate({
      sectionId: addLectureSection.id,
      title: trimmedTitle,
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const closeDialog = () => setDeleteTarget(null);

    if (deleteTarget.type === 'section') {
      const deletedIndex = sections.findIndex((section) => section.id === deleteTarget.id);
      const currentGuideBarIndex = guideBarIndex;

      deleteSectionMutation.mutate(deleteTarget.id, {
        onSuccess: (data) => {
          if (!data) return;

          if (
            currentGuideBarIndex !== null &&
            deletedIndex !== -1 &&
            deletedIndex <= currentGuideBarIndex
          ) {
            setGuideBarIndex(Math.max(0, currentGuideBarIndex - 1));
          }

          closeDialog();
        },
      });
    } else {
      deleteLectureMutation.mutate(deleteTarget.id, {
        onSuccess: (data) => {
          if (!data) return;

          closeDialog();
        },
      });
    }
  };

  return {
    sections,
    lectures,
    guideBarIndex,
    deleteTarget,
    addLectureSection,
    invalidateCourse,
    addSection: handleAddSection,
    moveGuideBarUp: handleMoveGuideBarUp,
    moveGuideBarDown: handleMoveGuideBarDown,
    requestDeleteSectionAboveGuideBar,
    requestDeleteLecture,
    requestDeleteSection,
    openAddLecture: handleOpenAddLecture,
    submitAddLecture: handleSubmitAddLecture,
    updateSectionTitle: handleUpdateSectionTitle,
    confirmDelete,
    cancelDelete,
    closeAddLectureDialog,
    isAddingSection: addSectionMutation.isPending,
    isAddingLecture: addLectureMutation.isPending,
    isUpdatingSection: updateSectionMutation.isPending,
    isDeletingSection: deleteSectionMutation.isPending,
    isDeletingLecture: deleteLectureMutation.isPending,
    lecture: {
      editLecture,
      setEditLecture,
      isEditLectureDialogOpen,
      setIsEditLectureDialogOpen,
    },
  };
}
