import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
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

    it('잘못된 데이터가 있는 경우 에러가 발생한다.', () => {
      // gievn
      const unValidatedConfig = {
        database: {
          url: undefined,
        },
        jwt: { authSecret: true },
        server: { port: 'test' },
      };
      vi.mocked(readFileSync).mockReturnValue('mocked-yaml-content');
      vi.mocked(yaml.load).mockReturnValue(unValidatedConfig);

      // when
      const fn = () => AppConfig.ofYml();

      // then
      expect(fn).toThrowErrorMatchingInlineSnapshot(`
        [Error: ❌ 설정 파일 검증 실패:
        An instance of AppConfig has failed the validation:
         - property database.url has failed the following constraints: isString 
        ,An instance of AppConfig has failed the validation:
         - property server.port has failed the following constraints: isNumber, max, min 
        ]
      `);
    });
  });

  describe('AppConfig 데이터 검증', () => {
    describe('database', () => {
      it('url이 비어있으면 에러가 발생한다.', () => {
        // gievn
        const config = plainToInstance(AppConfig, createValdateConfigObject());
        const unValdatedData = 123;
        config.database.url = unValdatedData as unknown as string;

        // when
        const errors = validateSync(config);

        // then
        expect(errors).toHaveLength(1);
        expect(errors[0].children?.[0].property).toBe('url');
        expect(errors[0].children?.[0].value).toBe(unValdatedData);
        expect(errors[0].children?.[0].constraints).toHaveProperty('isString');
      });
    });

    describe('jwt', () => {
      it('authSecret이 문자열이 아니면 에러가 발생한다.', () => {
        // gievn
        const config = plainToInstance(AppConfig, createValdateConfigObject());
        const unValdatedData = 123;
        config.jwt.authSecret = unValdatedData as unknown as string;

        // when
        const errors = validateSync(config);

        // then
        expect(errors).toHaveLength(1);
        expect(errors[0].children?.[0].property).toBe('authSecret');
        expect(errors[0].children?.[0].value).toBe(unValdatedData);
        expect(errors[0].children?.[0].constraints).toHaveProperty('isString');
      });
    });

    describe('server', () => {
      it('port가 숫자가 아니면 에러가 발생한다.', () => {
        // gievn
        const config = plainToInstance(AppConfig, createValdateConfigObject());
        const unValdatedData = 'test';
        config.server.port = unValdatedData as unknown as number;

        // when
        const errors = validateSync(config);

        // then
        expect(errors).toHaveLength(1);
        expect(errors[0].children?.[0].property).toBe('port');
        expect(errors[0].children?.[0].value).toBe(unValdatedData);
        expect(errors[0].children?.[0].constraints).toHaveProperty('isNumber');
      });
    });
  });
});

function createValdateConfigObject(): Required<AppConfig> {
  return {
    database: {
      url: 'postgresql://prisma:prismapass@localhost:5432/inflearn_clone?schema=public',
    },
    jwt: { authSecret: 'sd' },
    server: { port: 8000 },
  };
}
