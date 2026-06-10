import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';
import 'reflect-metadata';
import { AppConfig } from './AplicationConfig';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('js-yaml', () => ({
  default: {
    load: vi.fn(),
  },
}));

describe('AppConfig', () => {
  const validConfig = {
    database: { url: 'postgresql://prisma:prismapass@localhost:5432/inflearn_clone?schema=public' },
    jwt: { authSecret: 'asd' },
    server: { port: 8000 },
  };

  beforeEach(() => {
    vi.mocked(readFileSync).mockReturnValue('mocked-yaml-content');
    vi.mocked(yaml.load).mockReturnValue(validConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ofYml', () => {
    describe('given 유효한 yml 설정', () => {
      describe('when env를 지정하지 않으면', () => {
        it('then local-enviorment.yml을 읽고 검증된 AppConfig를 반환한다', () => {
          const config = AppConfig.ofYml();

          expect(readFileSync).toHaveBeenCalledWith(
            join(process.cwd(), 'enviorment', 'local-enviorment.yml'),
            'utf8',
          );
          expect(yaml.load).toHaveBeenCalledWith('mocked-yaml-content');
          expect(config).toBeInstanceOf(AppConfig);
          expect(config.database.url).toBe(validConfig.database.url);
          expect(config.jwt.authSecret).toBe(validConfig.jwt.authSecret);
          expect(config.server.port).toBe(validConfig.server.port);
        });
      });

      describe('when env를 production으로 지정하면', () => {
        it('then production-enviorment.yml 경로를 사용한다', () => {
          AppConfig.ofYml('production');

          expect(readFileSync).toHaveBeenCalledWith(
            join(process.cwd(), 'enviorment', 'production-enviorment.yml'),
            'utf8',
          );
        });
      });
    });

    describe('given 유효하지 않은 yml 설정', () => {
      describe('when server.port가 1 미만이면', () => {
        it('then 검증 오류를 던진다', () => {
          vi.mocked(yaml.load).mockReturnValue({
            ...validConfig,
            server: { port: 0 },
          });

          expect(() => AppConfig.ofYml()).toThrow('❌ 설정 파일 검증 실패');
        });
      });

      describe('when server.port가 9999를 초과하면', () => {
        it('then 검증 오류를 던진다', () => {
          vi.mocked(yaml.load).mockReturnValue({
            ...validConfig,
            server: { port: 10000 },
          });

          expect(() => AppConfig.ofYml()).toThrow('❌ 설정 파일 검증 실패');
        });
      });

      describe('when server.port가 누락되면', () => {
        it('then 검증 오류를 던진다', () => {
          vi.mocked(yaml.load).mockReturnValue({
            ...validConfig,
            server: {},
          });

          expect(() => AppConfig.ofYml()).toThrow('❌ 설정 파일 검증 실패');
        });
      });

      describe('when jwt.authSecret이 누락되면', () => {
        it('then 검증 오류를 던진다', () => {
          vi.mocked(yaml.load).mockReturnValue({
            ...validConfig,
            jwt: {},
          });

          expect(() => AppConfig.ofYml()).toThrow('❌ 설정 파일 검증 실패');
        });
      });

      describe('when database.url이 누락되면', () => {
        it('then 검증 오류를 던진다', () => {
          vi.mocked(yaml.load).mockReturnValue({
            ...validConfig,
            database: {},
          });

          expect(() => AppConfig.ofYml()).toThrow('❌ 설정 파일 검증 실패');
        });
      });
    });
  });
});
