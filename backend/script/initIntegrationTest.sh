#!/usr/bin/env bash

CONTAINER_NAME="inflearn-clone-db-test"

RED='\0033[0;31m'
GREEN='\0033[0;32m'
YELLOW='\0033[0;33m'
NC='\0033[0m' # No Color


# 에러 발생 시 커스텀 로그를 찍고 종료하는 함수
fail() {
    echo -e "\n${RED}❌ [Global Setup 에러] $1${NC}"
    exit 1
}

echo -e "${GREEN}🚀 통합 테스트 환경 초기화를 시작합니다.${NC}"


echo "🔍 [검증] Docker 데몬 실행 상태 확인 중..."
if ! docker info > /dev/null 2>&1; then
    fail "Docker 데몬이 꺼져 있습니다. Docker Desktop 앱을 실행해 주세요."
fi
echo -e "${GREEN}✅ Docker 데몬 실행 확인.${NC}"


# if docker ps --filter "name=${CONTAINER_NAME}" --filter "status=running" | grep -q "${CONTAINER_NAME}"; then
#     echo -e "${GREEN}🏎️ 컨테이너가 이미 구동 중 입니다. 초기화단계를 스킵합니다. ${NC}"
#     exit 0
# fi


# ---------------------------------------------------------
# [1단계] Docker Compose 구동
# ---------------------------------------------------------
echo -e "\n🐳 [1단계] 테스트용 도커 컨테이너 구동..."
docker compose -f docker-compose.test.yml up -d || fail "docker-compose.test.yml 구동에 실패했습니다. 파일 설정을 확인하세요."


# ---------------------------------------------------------
# [2단계] docker ps 조건문으로 컨테이너 정상 구동 여부 확인
# ---------------------------------------------------------
echo "⏳ [2단계] '${CONTAINER_NAME}' 컨테이너 활성화 상태 검증 중..."

# 컨테이너가 뜬 직후 잠시 대기
sleep 1 

# docker ps 명령어로 해당 컨테이너가 'running' 상태인지 필터링하여 확인
if ! docker ps --filter "name=${CONTAINER_NAME}" --filter "status=running" | grep -q "${CONTAINER_NAME}"; then
    echo -e "${YELLOW}⚠️ 컨테이너가 running 상태가 아닙니다. 전체 컨테이너 상태를 출력합니다:${NC}"
    docker ps -a --filter "name=${CONTAINER_NAME}"
    fail "'${CONTAINER_NAME}' 컨테이너가 정상적으로 정상 실행(running) 상태로 전환되지 못했습니다."
fi
echo -e "${GREEN}✅ 컨테이너 정상 구동 확인 (Running).${NC}"


echo "⏳ PostgreSQL 준비 상태 확인 중..."
for attempt in $(seq 1 30); do
    if docker exec "${CONTAINER_NAME}" pg_isready -U prisma > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL 준비 완료.${NC}"
        break
    fi

    if [ "${attempt}" -eq 30 ]; then
        fail "PostgreSQL이 30초 내에 준비되지 않았습니다."
    fi

    sleep 1
done

echo -e "\n🔄 [3단계] Prisma 스키마 푸시 (인프라 동기화)..."

# 실행 전 팁: 앞에서 발생한 yml 파일 경로 오타가 고쳐졌는지 확인 필요합니다.
if ! pnpm prisma db push; then
    echo -e "${YELLOW}💡 [참고] Prisma 실행 중 설정 로드 실패가 발생했습니다.${NC}"
    echo -e "${YELLOW}👉 에러 로그에 'test-enviorment.yml'을 찾을 수 없다고 나온다면, 프로젝트 내 파일 경로 오타(enviorment vs environment)를 확인하세요.${NC}"
    fail "Prisma db push 명령 수행 중 오류가 발생했습니다."
fi

echo -e "\n${GREEN}🎉 [성공] 모든 통합 테스트 인프라 환경이 완벽하게 구축되었습니다!${NC}"