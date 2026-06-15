'use client';

import { Course } from '@/generated/openapi.ts';
import { createContext, useContext, type ReactNode } from 'react';
import { useCurriculum } from '../_hooks/use-curriculum';

type CurriculumContextValue = ReturnType<typeof useCurriculum>;

const CurriculumContext = createContext<CurriculumContextValue | null>(null);

type CurriculumProviderProps = {
  course: Course;
  children: ReactNode;
};

export function CurriculumProvider({ course, children }: CurriculumProviderProps) {
  const value = useCurriculum(course);

  return <CurriculumContext.Provider value={value}>{children}</CurriculumContext.Provider>;
}

export function useCurriculumContext() {
  const context = useContext(CurriculumContext);

  if (!context) {
    throw new Error('useCurriculumContext는 CurriculumProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
