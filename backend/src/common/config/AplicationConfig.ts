import { plainToInstance, Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min, ValidateNested, validateSync } from 'class-validator';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

class Server {
  @Min(1)
  @Max(9999)
  @IsNumber()
  port: number;
}

class DatabaseConfig {
  @IsString()
  url: string;
}

class JwtConfig {
  @IsString()
  authSecret: string;
}

export class AppConfig {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  database: DatabaseConfig;

  @Type(() => JwtConfig)
  @ValidateNested()
  jwt: JwtConfig;

  @Type(() => Server)
  @ValidateNested()
  server: Server;

  static ofYml(env: string = 'local'): AppConfig {
    const configPath = join(process.cwd(), 'enviorment', `${env}-enviorment.yml`);

    const configObject = yaml.load(readFileSync(configPath, 'utf8'));

    const validatedConfig = plainToInstance(AppConfig, configObject, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig);
    if (errors.length > 0) {
      throw new Error(`❌ 설정 파일 검증 실패:\n${errors.toString()}`);
    }

    return validatedConfig;
  }
}
