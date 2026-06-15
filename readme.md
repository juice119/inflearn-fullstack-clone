# 인프런 클론 프로젝트

인프런의 핵심 기능을 학습·구현하기 위한 풀스택 클론 프로젝트입니다.  
강의 생성·편집, 커리큘럼(섹션/강의) 관리, 강사 대시보드을 중심으로 개발하고 있습니다.

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

## 사전 요구사항

- [Node.js](https://nodejs.org/) 20 이상
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) / Docker Compose

## 로컬 실행

### 1. 저장소 클론 및 루트 의존성 설치

```bash
git clone <repository-url>
cd inflearn-fullstack-clone
pnpm install
```

### 2. PostgreSQL 실행

```bash
cd backend
docker compose up -d
```

| 항목     | 값               |
| -------- | ---------------- |
| Host     | `localhost`      |
| Port     | `5432`           |
| User     | `prisma`         |
| Password | `prismapass`     |
| Database | `inflearn_clone` |

### 3. 로컬 Backend 설정 및 실행

`backend/enviorment/local-enviorment.yml` 파일을 생성합니다. (디렉터리명 `enviorment`는 프로젝트 고유 철자입니다.)

```yaml
database:
  url: postgresql://prisma:prismapass@localhost:5432/inflearn_clone?schema=public
jwt:
  authSecret: your-jwt-secret
server:
  port: 8000
```

```bash
cd backend
pnpm install
pnpm db:gen
pnpm db:push
pnpm seed          # 카테고리 시드 데이터 (선택)
pnpm start:local-dev
```

서버가 정상 기동되면 아래 주소에서 확인할 수 있습니다.

- API 서버: http://localhost:8000
- Swagger 문서: http://localhost:8000/docs

### 로컬 4. Frontend 설정 및 실행

`frontend/.env` 파일을 생성합니다.

```env
DATABASE_URL=postgresql://prisma:prismapass@localhost:5432/inflearn_clone?schema=public
AUTH_SECRET=your-auth-secret
API_URL=http://localhost:8000
```

```bash
cd frontend
pnpm install
pnpm db:gen
pnpm dev
```

프론트엔드: http://localhost:3000

### 5. OpenAPI 클라이언트 생성 (선택)

Backend가 실행 중인 상태에서 API 스펙이 변경되었을 때 클라이언트를 재생성합니다.

```bash
cd frontend
pnpm openapi-ts
```

## 주요 기능

### 구현 완료

- 회원가입 / 로그인 (NextAuth Credentials)
- 강의 생성 및 기본 정보 수정
- 커리큘럼 관리 (섹션·강의 CRUD)
- 강사 대시보드 및 강의 목록
- 카테고리 조회 API

### 스키마 정의 (UI 미구현)

- 수강 등록 (`CourseEnrollment`)
- 강의 리뷰 (`CourseReview`)
- Q&A 및 댓글 (`CourseQuestion`, `CourseComment`)
- 학습 진도 (`LectureActivity`)

## API 개요

| 도메인       | 경로 prefix   | 설명           |
| ------------ | ------------- | -------------- |
| Health Check | `GET /hc`     | 서버 상태 확인 |
| Categories   | `/categories` | 카테고리 목록  |
| Courses      | `/courses`    | 강의 CRUD      |
| Sections     | `/sections`   | 섹션 CRUD      |
| Lectures     | `/lectures`   | 강의 CRUD      |

상세 스펙은 Swagger 문서(http://localhost:8000/docs)를 참고하세요.

## 테스트

Backend 디렉터리에서 실행합니다. 통합·E2E 테스트는 Docker가 필요합니다.

### 단위 테스트

```bash
cd backend
pnpm test:unit
```

### 통합 테스트

`backend/enviorment/test-enviorment.yml` 파일이 필요합니다.

```yaml
database:
  url: postgresql://prisma:prismapass@localhost:5433/inflearn_clone-test?schema=public
jwt:
  authSecret: test-jwt-secret
server:
  port: 8000
```

```bash
cd backend
pnpm test:int-setup   # 테스트용 DB 컨테이너 구동 및 스키마 동기화
pnpm test:int
```

### E2E 테스트

```bash
cd backend
pnpm test:e2e-setup
pnpm test:e2e
```

### 전체 테스트

```bash
cd backend
pnpm test:all
```

## 테스트 구조

`src/` 내부에 테스트 파일을 두지 않습니다. `test/` 디렉터리가 `src/` 구조를 미러링합니다.

| 디렉터리            | 유형        | 설명                                |
| ------------------- | ----------- | ----------------------------------- |
| `test/unit/`        | 단위 테스트 | DB 없이 도메인·순수 로직 검증       |
| `test/integration/` | 통합 테스트 | Docker DB 기반 Service 레이어 검증  |
| `test/e2e/`         | E2E 테스트  | Playwright 기반 API 엔드포인트 검증 |

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
