# 🧪 NestJS 백엔드 테스트 전략 및 표준 아키텍처 가이드

## 1. 핵심 아키텍처 요약 (Directory & Naming)

단위(Unit) 및 통합(Integration) 테스트는 실제 구현 코드와 유기적으로 결합되도록 `src/` 내부에 나란히 위치(Co-location)시키며, 전체 시스템을 관통하는 E2E 테스트는 최상위 `test/` 폴더로 격리하여 파일 시스템 뎁스를 최소화합니다.

```text
📁 backend/
   ├── 📁 src/                          # 구현 코드 및 소형/중형 테스트
   │    └── 📁 lecture/
   │         ├── 📄 lecture.service.ts
   │         ├── 📄 lecture.service.unit.spec.ts  # ① 단위 테스트 (Vitest)
   │         └── 📄 lecture.service.int.spec.ts   # ② 통합 테스트 (Vitest)
   │
   └── 📁 test/                         # 대형 테스트 (인프라 및 전체 시스템 관통)
        ├── 📄 global-setup.ts          # Docker DB 및 글로벌 환경 세팅
        └── 📄 lecture.e2e.spec.ts      # ③ E2E API 테스트 (Playwright)
```

---

## 2. 테스트 레이어별 역할 분담 (중복 제로 원칙)

동일한 비즈니스 규칙을 여러 레이어에서 중복 검증하는 비효율을 제거하기 위해, 각 테스트 단계의 검사 경계(Boundary)를 명확히 분리합니다.

| 분류            | 단위 테스트 (Unit)                         | 통합 테스트 (Integration)                                                     | E2E 테스트 (End-to-End)                                                         |
| :-------------- | :----------------------------------------- | :---------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **테스트 대상** | 엔티티 규칙, 순수 비즈니스 도메인 로직     | 서비스 레이어 (`*.service.ts`)                                                | 전체 애플리케이션 및 API 엔드포인트                                             |
| **의존성 (DB)** | 불필요 (Mocking을 최소화한 순수 함수 검증) | **필수 (Docker 로컬 컨테이너 DB)**                                            | **필수 (Docker DB + 서버 전체 구동)**                                           |
| **검증 범위**   | 알고리즘, 유효성 검사 규칙                 | **비즈니스 시나리오의 모든 엣지 케이스**<br>(성공/실패/예외 케이스 100% 검증) | **핵심 사용자 흐름 (Happy Path)**<br>인증 가드, 라우팅, DTO 검증 등 문지기 역할 |
| **사용 도구**   | Vitest                                     | Vitest                                                                        | Playwright (API Testing Client)                                                 |

---

## 3. 실전 시나리오 적용 가이드 (예시: 강의 수정 기능)

"자신이 만든 강의는 수정할 수 있다"라는 기획을 구현할 때, 중복 없이 테스트 코드를 분배하는 정석 설계 예시입니다.

### 🧪 `src/lecture/lecture.service.int.spec.ts` (통합 테스트)

비즈니스 로직의 올바름을 검증하기 위해 **모든 경우의 수(Edge Cases)**를 꼼꼼하게 검증합니다.

- **[성공 케이스]** 작성자가 본인의 강의 수정을 요청하면 데이터베이스에 올바르게 반영되는가?
- **[실패 케이스]** 다른 사용자가 수정을 시도할 때 `ForbiddenException`이 정상적으로 발생하는가?
- **[실패 케이스]** 존재하지 않는 강의 ID로 수정을 요청할 때 `NotFoundException`을 반환하는가?

### 🎭 `test/lecture.e2e.spec.ts` (E2E 테스트)

네트워크와 인프라, 보안이 잘 통하는지 **성공 경로(Happy Path)와 글로벌 인증 차단**만 검증합니다.

- **[성공 (Happy Path)]** `로그인` ➡️ `토큰 획득` ➡️ `헤더에 토큰 첨부` ➡️ `PATCH /api/lectures/1` 호출 ➡️ `200 OK` 및 정상 데이터 응답 확인
- **[보안 검증]** 인증 토큰 없이 `PATCH /api/lectures/1` 호출 ➡️ 로직을 타기 전에 글로벌 JWT 가드가 `401 Unauthorized`로 튕겨내는지 확인

---

## 5. 실행 스크립트 구성 (`package.json`)

```json
{
  "scripts": {
    "test:unit": "vitest run .unit.spec.ts",
    "test:int": "vitest run .int.spec.ts",
    "test:e2e": "playwright test",
    "test:all": "pnpm test:unit && pnpm test:int && pnpm test:e2e"
  }
}
```
