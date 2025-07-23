// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionMiddleware } from './common/middlewares/http-exception.middleware';
import { msgPersona } from './common/pipes/msgPersona.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(msgPersona());
  app.use(new HttpExceptionMiddleware().use);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
