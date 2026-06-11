import { execSync } from 'child_process';
import path from 'path';

const INIT_SCRIPT_FILE_NAME = 'initIntegrationTest.sh';

function initIntegrationTestSetup() {
  console.log('\n🐳 [Global Setup] 테스트용 도커 컨테이너 구동 시작...');

  try {
    const initScriptPath = path.join(__dirname, '..', '..', 'script', INIT_SCRIPT_FILE_NAME);
    execSync(`sh ${initScriptPath}`);

    console.log('🚀 모든 통합 테스트 준비 완료!\n');
  } catch (error) {
    console.error('❌ [Global Setup] 에러 발생. 테스트를 중단합니다:', error);
    process.exit(1); // 에러 발생 시 즉시 프로세스 종료
  }
}

initIntegrationTestSetup();
