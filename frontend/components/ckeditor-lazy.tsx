'use client';

import dynamic from 'next/dynamic';

const CKEditorLazy = dynamic(() => import('@/components/ckeditor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-[#DEE2E6] bg-white text-sm text-[#868E96]">
      에디터 로딩 중...
    </div>
  ),
});

export default CKEditorLazy;
