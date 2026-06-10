// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig(
  // 1. 린트 검사에서 제외할 폴더 설정
  {
    ignores: ['dist', 'node_modules', 'eslint.config.mjs', 'src/_gen/**'],
  },

  // 2. 기본 권장 규칙 및 TypeScript 권장 규칙 적용
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Prettier 플러그인 연동 (★충돌 방지 및 결합 핵심 설정)
  eslintPluginPrettierRecommended,

  // 4. 환경 및 파서 옵션 설정 (NestJS 전용)
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 5. 커스텀 린트 규칙 설정
  {
    rules: {
      // 💡 안 쓰는 변수가 있으면 경고(warn)를 띄웁니다.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // NestJS 데코레이터 패턴에서 불필요한 엄격함 완화
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 시 경고
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // Prettier 포맷팅 에러를 ESLint 에러(빨간줄)로 강제 표시
      'prettier/prettier': 'error',
    },
  },
);
