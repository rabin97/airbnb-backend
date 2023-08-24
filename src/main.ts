import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { EnvironmentVariable } from './utils/env.validation';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { yellow } from '@nestjs/common/utils/cli-colors.util';
declare const module: {
  hot: any;
};

const globalPrefix = 'api';
const port = process.env.PORT || 5000;
const logger = new Logger('Main');

const config = new ConfigService<EnvironmentVariable, true>();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setDescription('Airbnb Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('app', app, document);
  await app.listen(port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
const start = Date.now();
bootstrap().then(() => {
  const end = Date.now();
  logger.log(`🚀 Application started in ${yellow(end - start + 'ms')}`);
  logger.log(
    `🚀 ${
      config.get('NODE_ENV') || 'development'
    } is running on: http://localhost:${port}/${globalPrefix} 🚀🚀`,
  );
});
