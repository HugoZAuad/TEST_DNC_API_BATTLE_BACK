import { ValidationPipe, BadRequestException } from '@nestjs/common';

export function msgPersona() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(
        (error) =>
          `${error.property} - ${Object.values(error.constraints ?? {}).join(', ')}`
      );
      return new BadRequestException(messages.join('; '));
    },
  });
}
