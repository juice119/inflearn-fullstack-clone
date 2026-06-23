# 인프런 클론 프로젝트

인프런의 핵심 기능을 학습·구현하기 위한 풀스택 클론 프로젝트입니다.  
강의 생성·편집, 커리큘럼(섹션/강의) 관리, 강사 대시보드를 중심으로 개발하고 있습니다.

## 기술 스택

| 영역          | 기술                                                              |
| ------------- | ----------------------------------------------------------------- |
| Frontend      | Next.js, React, NextAuth, TanStack Query, shadcn/ui, Tailwind CSS |
| Backend       | NestJS, Prisma, PostgreSQL, JWT, Swagger                          |
| 백엔드 테스트 | Vitest (unit / integration), Playwright (e2e)                     |
| 공통          | pnpm, Husky, lint-staged                                          |

## 프로젝트 구조

```
inflearn-fullstack-clone/
├── frontend/          # Next.js 앱 (UI, NextAuth, OpenAPI 클라이언트)
├── backend/           # NestJS API 서버
│   ├── prisma/        # DB 스키마 및 시드
│   ├── test/          # unit / integration / e2e 테스트
│   └── enviorment/    # 환경별 YAML 설정 (gitignore, 로컬에서 직접 생성)
├── scripts/           # lint-staged 스크립트
└── .husky/            # Git pre-commit 훅
```

## 주요 기능

- 회원가입 / 로그인
- 프로필 수정
- 강의 리스트 및 조회
- 강의 상세 페이지
- 학습 페이지 (수업 강의 시청 및 이어보기)
- 강의 생성 및 수정
- 커리큘럼 관리 (강의 - 섹션 - 수업)
- 지식공유자 강의 목록

자세한 내용은 [기능명세서](./docs/기능명세서.md)를 참조해주세요.

## 문서

| 문서 | 설명 |
| ---- | ---- |
| [개발환경세팅](./docs/개발환경세팅.md) | 로컬 실행 가이드 |
| [환경변수](./docs/환경변수.md) | Backend YAML·Frontend `.env` 레퍼런스 |
| [아키텍처](./docs/아키텍처.md) | 인증·DB·미디어·OpenAPI 흐름 |
| [백엔드테스트](./docs/백엔드테스트.md) | 테스트 실행 방법 |
| [기능명세서](./docs/기능명세서.md) | 기능·필드 규칙 |

## API

상세 스펙은 [Swagger 문서](http://localhost:8000/docs)를 참고하세요. (Backend 로컬 실행 후 접근 가능)

## 테스트

백엔드 테스트 실행 방법은 [백엔드테스트](./docs/백엔드테스트.md) 문서를 참조해주세요.

## 개발 컨벤션

### 커밋 메시지

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따르며, subject와 body는 **한국어**로 작성합니다.

```
feat(backend): JWT 기반 액세스 토큰 발급 기능 구현
fix(frontend): 모바일 뷰 결제 버튼 미정렬 오류 수정
```

### 코드 품질

- Pre-commit: Husky + lint-staged (ESLint, Prettier)
- Backend: `pnpm lint`, `pnpm format`
- Frontend: `pnpm lint`, `pnpm format`

## VS Code 디버깅

`.vscode/launch.json`에 아래 구성이 포함되어 있습니다.

- **NestJS: pnpm Debug** — Backend 디버그 모드 실행
- **Next.js: 내장 브라우저 원클릭 디버깅** — Frontend 개발 서버 + 브라우저 디버깅
