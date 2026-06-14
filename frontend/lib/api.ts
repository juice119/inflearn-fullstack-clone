'use server';

import {
  categoriesControllerFindAll,
  coursesControllerCreate,
  coursesControllerFindAll,
  coursesControllerFindOne,
  coursesControllerUpdate,
  UpdateCourseDto,
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

export async function getCourseById(id: string) {
  const response = await coursesControllerFindOne({
    path: {
      id,
    },
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
