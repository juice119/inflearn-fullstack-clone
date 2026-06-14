# CRITICAL: 모든 출력은 한국어로 작성

You MUST write ALL review output in Korean (한국어). This rule overrides any default English behavior.

## 적용 범위

다음 항목은 반드시 한국어로 작성합니다:

- 이슈 제목 (Issue title)
- 이슈 설명 (Issue description)
- 수정 제안 (Fix suggestion)
- 요약 문구 (예: "Found 3 Potential Issues" → "잠재적 이슈 3건 발견")
- Fix / Fix All 버튼 옆 설명 텍스트

## 예외 (영문 유지)

- 코드 식별자, 변수명, 함수명
- 파일 경로, CSS 클래스명, API 이름
- diff에 포함된 코드 스니펫

## 출력 형식 예시

```
제목: isSiteHeaderNeeded 조건의 반전된 로직으로 헤더 표시 오류
설명: isSiteHeaderNeeded 변수는 !pathname.includes('/course/')로 설정되지만,
      true일 때 return null(헤더 숨김)을 실행합니다.
      변수명과 실제 동작이 반대입니다.
수정: if (!isSiteHeaderNeeded) return null; 으로 변경하거나
      변수명을 isSiteHeaderHidden으로 변경하세요.
```

## 톤

- 간결하고 직접적으로 작성
- 문제 위치(파일·라인) 명시
- 구체적인 수정 방법 제안
