# 🧪 NestJS 백엔드 테스트 전략 및 표준 아키텍처 가이드

## 1. 핵심 아키텍처 요약 (Directory & Naming)

모든 테스트는 `src/` 밖의 `test/` 디렉터리에만 위치하며, `test/unit/`·`test/integration/`·`test/e2e/` 아래에는 `src/`와 동일한 하위 폴더 구조를 미러링합니다.

```text
📁 backend/
   ├── 📁 src/
   │    ├── 📁 common/config/
   │    │    └── 📄 AplicationConfig.ts
   │    └── 📁 lecture/
   │         ├── 📄 lecture.service.ts
   │         └── 📄 lecture.controller.ts
   │
   └── 📁 test/
        ├── 📁 unit/                              # ① 단위 테스트: src/ 구조 미러링
        │    └── 📁 common/config/
        │         └── 📄 AplicationConfig.spec.ts
        │
        ├── 📁 integration/                     # ② 통합 테스트: src/ 구조 미러링
        │    └── 📁 lecture/
        │         └── 📄 lecture.service.spec.ts
        │
        └── 📁 e2e/                             # ③ E2E 테스트
             └── 📄 lecture.spec.ts
```

---

## 2. 테스트 레이어별 역할 분담 (중복 제로 원칙)

동일한 비즈니스 규칙을 여러 레이어에서 중복 검증하는 비효율을 제거하기 위해, 각 테스트 단계의 검사 경계(Boundary)를 명확히 분리합니다.

| 분류            | 단위 테스트 (Unit)                         | 통합 테스트 (Integration)                                                  | E2E 테스트 (End-to-End)                                                      |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **테스트 대상** | 엔티티 규칙, 순수 비즈니스 도메인 로직     | 서비스 레이어 (`*.service.ts`)                                             | 전체 애플리케이션 및 API 엔드포인트                                          |
| **의존성 (DB)** | 불필요 (Mocking을 최소화한 순수 함수 검증) | **필수 (Docker 로컬 컨테이너 DB)**                                         | **필수 (Docker DB + 서버 전체 구동)**                                        |
| **검증 범위**   | 알고리즘, 유효성 검사 규칙                 | **비즈니스 시나리오의 모든 엣지 케이스** (성공/실패/예외 케이스 100% 검증) | **핵심 사용자 흐름 (Happy Path)** 인증 가드, 라우팅, DTO 검증 등 문지기 역할 |
| **사용 도구**   | Vitest                                     | Vitest + docker                                                            | Playwright (API Testing Client)                                              |

---

## 3. 실전 시나리오 적용 가이드 (예시: 강의 수정 기능)

"자신이 만든 강의는 수정할 수 있다"라는 기획을 구현할 때, 중복 없이 테스트 코드를 분배하는 정석 설계 예시입니다.

### 🧪 `test/integration/lecture/lecture.service.spec.ts` (통합 테스트)

비즈니스 로직의 올바름을 검증하기 위해 **모든 경우의 수(Edge Cases)**를 꼼꼼하게 검증합니다.

- **[성공 케이스]** 작성자가 본인의 강의 수정을 요청하면 데이터베이스에 올바르게 반영되는가?
- **[실패 케이스]** 다른 사용자가 수정을 시도할 때 `ForbiddenException`이 정상적으로 발생하는가?
- **[실패 케이스]** 존재하지 않는 강의 ID로 수정을 요청할 때 `NotFoundException`을 반환하는가?

### 🎭 `test/e2e/lecture.spec.ts` (E2E 테스트)

네트워크와 인프라, 보안이 잘 통하는지 **성공 경로(Happy Path)와 글로벌 인증 차단**만 검증합니다.

- **[성공 (Happy Path)]** `로그인` ➡️ `토큰 획득` ➡️ `헤더에 토큰 첨부` ➡️ `PATCH /api/lectures/1` 호출 ➡️ `200 OK` 및 정상 데이터 응답 확인
- **[보안 검증]** 인증 토큰 없이 `PATCH /api/lectures/1` 호출 ➡️ 로직을 타기 전에 글로벌 JWT 가드가 `401 Unauthorized`로 튕겨내는지 확인

---

## 4.테스트 코드 구성

- given, when, then 주석으로 나누기
- 한글명으로 작성하기

```typescript
describe('AppConfig', () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ofYml', () => {
    it('yaml파일을 읽어서 직렬화한다.', () => {
      // gievn
      const validConfig = createValdateConfigObject();
      vi.mocked(readFileSync).mockReturnValue('mocked-yaml-content');
      vi.mocked(yaml.load).mockReturnValue(validConfig);

      // when
      const config = AppConfig.ofYml();

      // then
      expect(config).instanceOf(AppConfig);
      expect(config).toEqual(validConfig);
    });
  });
});
```

## 5. 테스트 실행 방법

### unit

```sh
pnpm test:unit
```

### integration

```sh
# docker 및 외부 의존성을 위한 스크립트 !부팅후 한번만 실행하기
pnpm test:int-setup

pnpm test:int
```

### E2E

Playwright가 테스트 실행 시 Docker DB 구동 → NestJS 서버 기동을 자동으로 수행합니다.

```sh
# E2E 테스트 (인프라 + 서버 자동 기동)
pnpm test:e2e

# Playwright UI 모드
pnpm test:e2e-ui
```

인프라를 미리 준비해 두고 E2E만 반복 실행하려면:

```sh
pnpm test:e2e-setup
SKIP_TEST_INFRA_SETUP=1 pnpm test:e2e
```
