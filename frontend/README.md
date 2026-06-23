# Frontend

Next.js 앱입니다.

## 문서

| 문서 | 설명 |
| ---- | ---- |
| [개발환경세팅](../docs/개발환경세팅.md) | 로컬 실행 |
| [환경변수](../docs/환경변수.md) | `.env` 레퍼런스 |
| [아키텍처](../docs/아키텍처.md) | 인증·OpenAPI 흐름 |
| [기능명세서](../docs/기능명세서.md) | 기능·필드 규칙 |

## 주요 스크립트

```bash
pnpm dev          # 개발 서버 (http://localhost:3000)
pnpm db:gen       # Prisma 클라이언트 생성
pnpm openapi-ts   # OpenAPI 클라이언트 재생성 (Backend 실행 필요)
pnpm lint         # ESLint
pnpm format       # Prettier
```
