import { Lecture, Section } from '@/generated/openapi.ts';

export type DeleteTarget = { type: 'section'; id: string } | { type: 'lecture'; id: string };

export const DEFAULT_LECTURE_TITLE = '새 수업';

export const MAX_LECTURE_TITLE_LENGTH = 200;

export const MAX_SECTION_TITLE_LENGTH = 200;

export type VideoStorageInfo = {
  fileName: string;
  fileSize: number;
  contentType: string;
  fileUrl: string;
};

export function parseVideoStorageInfo(info: unknown): VideoStorageInfo | null {
  if (!info || typeof info !== 'object') return null;

  const record = info as Record<string, unknown>;

  return {
    fileName: typeof record.fileName === 'string' ? record.fileName : '',
    fileSize: typeof record.fileSize === 'number' ? record.fileSize : 0,
    contentType: typeof record.contentType === 'string' ? record.contentType : '',
    fileUrl: typeof record.fileUrl === 'string' ? record.fileUrl : '',
  };
}

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
