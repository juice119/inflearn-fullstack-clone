'use server';

import {
  categoriesControllerFindAll,
  coursesControllerCreate,
  coursesControllerFindAll,
  coursesControllerFindOne,
  coursesControllerUpdate,
  CreateLectureDto,
  lecturesControllerCreate,
  lecturesControllerDelete,
  lecturesControllerUpdate,
  mediaControllerUpload,
  sectionsControllerCreate,
  sectionsControllerDelete,
  sectionsControllerUpdate,
  SignUpRequestDto,
  UpdateCourseDto,
  UpdateLectureDto,
  UpdateSectionDto,
  userControllerSignUp,
} from '@/generated/openapi.ts';

function serializeApiResponse<T>({ data, error }: { data: T | undefined; error: unknown }): {
  data: T | null;
  error: { message: string | null; isError: boolean } | null;
} {
  if (error === undefined && data !== undefined) return { data, error: null };

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return { data: null, error: { message: error.message, isError: true } };
  }

  return { data: null, error: { message: '서버에 요청중 오류가 발생했습니다.', isError: true } };
}

export const getAllCategories = async () => {
  const { data, error } = await categoriesControllerFindAll();
  return { data, error };
};

export const getAllInstructorCourses = async () => {
  const { data, error } = await coursesControllerFindAll();
  return { data, error };
};

export async function createCourse(title: string) {
  const response = await coursesControllerCreate({
    body: {
      title,
      //@Todo slug 변환 추가 필ㅛ
      slug: title,
      shortDescription: '',
      description: '',
      thumbnailUrl: '',
      price: 0,
      discountPrice: 0,
      level: 'BEGINNER',
      categoryIds: [],
    },
  });
  return serializeApiResponse(response);
}

export async function getCourseById(id: string, include?: string) {
  const response = await coursesControllerFindOne({
    path: {
      id,
    },
    query: include ? { include } : undefined,
  });
  return serializeApiResponse(response);
}

export async function updateCourse(id: string, data: UpdateCourseDto) {
  const response = await coursesControllerUpdate({
    path: {
      id,
    },
    body: data,
  });
  return serializeApiResponse(response);
}

export async function createSection(courseId: string, title: string) {
  const response = await sectionsControllerCreate({
    path: {
      courseId,
    },
    body: {
      title,
    },
  });
  return serializeApiResponse(response);
}

export async function deleteSection(sectionId: string) {
  const response = await sectionsControllerDelete({
    path: {
      sectionId,
    },
  });
  return serializeApiResponse(response);
}

export async function updateSection(sectionId: string, data: UpdateSectionDto) {
  const response = await sectionsControllerUpdate({
    path: {
      sectionId,
    },
    body: data,
  });
  return serializeApiResponse(response);
}

export async function createLecture(courseId: string, sectionId: string, data: CreateLectureDto) {
  const response = await lecturesControllerCreate({
    path: {
      courseId,
      sectionId,
    },
    body: data,
  });
  return serializeApiResponse(response);
}

export async function deleteLecture(lectureId: string) {
  const response = await lecturesControllerDelete({
    path: {
      id: lectureId,
    },
  });
  return serializeApiResponse(response);
}

export async function uploadMediaFile(file: File) {
  const response = await mediaControllerUpload({
    body: {
      file,
    },
  });
  return serializeApiResponse(response);
}

export async function updateLecture(lectureId: string, data: UpdateLectureDto) {
  const response = await lecturesControllerUpdate({
    path: {
      id: lectureId,
    },
    body: data,
  });
  return serializeApiResponse(response);
}

export async function signUp(requestDto: SignUpRequestDto) {
  const response = await userControllerSignUp({
    body: requestDto,
  });
  return serializeApiResponse(response);
}
