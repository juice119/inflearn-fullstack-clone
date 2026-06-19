'use client';

import { CKEditor as CKEditorReact } from '@ckeditor/ckeditor5-react';
import {
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Image,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  Table,
  TableToolbar,
  type Editor,
  type EditorConfig,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useEffect, useRef } from 'react';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const EDITOR_CONFIG: EditorConfig = {
  licenseKey: 'GPL',
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Link,
    Image,
    ImageUpload,
    Table,
    TableToolbar,
    BlockQuote,
    List,
    Heading,
    Indent,
    Base64UploadAdapter,
  ],
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
    poweredBy: {
      forceVisible: false,
    },
  },
};

export default function CKEditor({ value, onChange }: CKEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentData = editor.getData();
    if (value !== currentData) {
      editor.setData(value);
    }
  }, [value]);

  return (
    <div className="ck-editor-container prose w-full max-w-none [&_.ck-editor]:w-full">
      <CKEditorReact
        editor={ClassicEditor}
        config={EDITOR_CONFIG}
        data={value}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onAfterDestroy={() => {
          editorRef.current = null;
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          if (data !== value) {
            onChangeRef.current(data);
          }
        }}
      />
    </div>
  );
}
