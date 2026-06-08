import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateInvitationConfig } from './email/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Fail fast if SMTP / APP_BASE_URL configuration is missing or invalid,
  // before the HTTP listener starts.
  validateInvitationConfig(process.env);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const first = errors[0];
        const constraint =
          Object.values(first.constraints ?? {})[0] ?? 'Validation failed.';
        return new BadRequestException(constraint);
      },
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('BDT API')
    .setDescription('Business Diagnostics Tool API')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
