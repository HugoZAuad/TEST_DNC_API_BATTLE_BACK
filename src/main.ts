import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionMiddleware } from './common/middlewares/http-exception.middleware';
import { msgPersona } from './common/pipes/msgPersona.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGINS?.split(',') ?? [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(msgPersona());
  app.use(new HttpExceptionMiddleware().use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
