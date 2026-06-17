import { plainToInstance, Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
  validateSync,
} from 'class-validator';
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

class AwsConfig {
  @IsString()
  s3Region: string;

  @IsString()
  mediaFileBucketName: string;

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  cloudFrontDomain: string;

  @IsOptional()
  @IsString()
  profile?: string;
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

  @Type(() => AwsConfig)
  @ValidateNested()
  aws: AwsConfig;

  @IsString()
  @IsIn(['local', 'development', 'production', 'test'])
  enviroment: string;

  static ofYml(enviroment: string = 'local'): AppConfig {
    const configPath = join(process.cwd(), 'enviorment', `${enviroment}-enviorment.yml`);

    const configObject = yaml.load(readFileSync(configPath, 'utf8')) as Record<string, unknown>;
    configObject['enviroment'] = enviroment;

    const validatedConfig = plainToInstance(AppConfig, configObject, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig);
    if (errors.length > 0) {
      throw new Error(`❌ 설정 파일 검증 실패:\n${errors.toString()}`);
    }

    return validatedConfig;
  }

  get isTest(): boolean {
    return this.enviroment === 'test';
  }

  get listenPort(): number {
    if (this.isTest && process.env.PORT) {
      return Number(process.env.PORT);
    }

    return this.server.port;
  }

  get hasAwsProfile(): boolean {
    return this.aws.profile !== undefined;
  }
}
