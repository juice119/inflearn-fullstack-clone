import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfig } from './common/config/AplicationConfig';

async function bootstrap() {
  const appConfig = AppConfig.ofYml(process.env.NODE_ENV || '');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      enableImplicitConversion: false,
      exposeUnsetFields: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Inflearn API 문서')
    .setDescription('Inflearn API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'jwt 토큰 입력',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appConfig.listenPort);
  console.log(`🚀 애플리케이션 서버가 구동 되었습니다 PORT: ${appConfig.listenPort}`);
}
void bootstrap();
