'use client';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useEffect, useRef, useState } from 'react';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CKEditor = ({ value, onChange }: CKEditorProps) => {
  const editorRef = useRef<ClassicEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    let isCancelled = false;

    const loadEditor = async () => {
      try {
        const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;

        if (isCancelled || !containerRef.current) return;

        const editorInstance = await ClassicEditor.create(containerRef.current, {
          licenseKey: 'GPL',
          initialData: valueRef.current,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'undo',
            'redo',
          ],
          language: 'ko',
          ui: {
            poweredBy: { forceVisible: false },
          },
        });

        if (isCancelled) {
          await editorInstance.destroy();
          return;
        }

        editorInstance.model.document.on('change:data', () => {
          const data = editorInstance.getData();
          if (data !== valueRef.current) {
            onChangeRef.current(data);
          }
        });

        editorRef.current = editorInstance;
        setIsEditorReady(true);
      } catch (error) {
        if (!isCancelled) {
          console.error('CKEditor 초기화 오류:', error);
        }
      }
    };

    void loadEditor();

    return () => {
      isCancelled = true;
      const editor = editorRef.current;
      editorRef.current = null;

      if (editor) {
        void editor.destroy().catch((error: unknown) => {
          console.error('에디터 정리 중 오류 발생:', error);
        });
      }
    };
  }, []);

  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== editorRef.current.getData()) {
      editorRef.current.setData(value);
    }
  }, [value, isEditorReady]);

  return (
    <div className="ck-editor-container [&_.ck-content]:min-h-100! [&_.ck-content]:overflow-y-auto">
      <div ref={containerRef} className="border p-4 rounded">
        {!isEditorReady && '에디터 로딩 중...'}
      </div>
    </div>
  );
};

export default CKEditor;
