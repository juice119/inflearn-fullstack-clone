import { Lecture, Section } from '@/generated/openapi.ts';

export type DeleteTarget = { type: 'section'; id: string } | { type: 'lecture'; id: string };

export const DEFAULT_LECTURE_TITLE = '새 수업';

export const MAX_LECTURE_TITLE_LENGTH = 200;

export const MAX_SECTION_TITLE_LENGTH = 200;

export function getActiveSections(sections: Section[] = []) {
  return sections.filter((section) => !section.deletedAt).sort((a, b) => a.order - b.order);
}

export function getActiveLectures(lectures: Lecture[] = []) {
  return lectures.filter((lecture) => !lecture.deletedAt);
}

export function getSectionLectures(section: Section, lectures: Lecture[]) {
  return lectures
    .filter((lecture) => lecture.sectionId === section.id && !lecture.deletedAt)
    .sort((a, b) => a.order - b.order);
}

export function getNextLectureOrder(sectionLectures: Lecture[]) {
  if (sectionLectures.length === 0) return 1;

  return Math.max(...sectionLectures.map((lecture) => lecture.order)) + 1;
}
