/* istanbul ignore file */
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { setupVersionPrefixAndPipes } from './configuration/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Template API (TODO: UPDATE THIS!)')
    .setDescription('Template for building Web APIs (TODO: UPDATE THIS!)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  setupVersionPrefixAndPipes(app);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();

  await app.listen(configService.get('server.port'));
}
bootstrap();
