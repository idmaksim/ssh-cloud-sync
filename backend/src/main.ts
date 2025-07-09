import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { SecretKeyGuard } from './guards/secret-key.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('SSH Cloud Sync API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'X-Secret-Key', in: 'header' },
      'X-Secret-Key',
    )
    .build();

  app.use('/docs', (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if (!auth || typeof auth !== 'string') {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API"');
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    const [type, credentials] = auth.split(' ');

    if (type !== 'Basic') {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    const validUsername = configService.get<string>('swagger.user');
    const validPassword = configService.get<string>('swagger.password');

    if (username !== validUsername || password !== validPassword) {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }
    next();
  });

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      preloadModels: false,
      tryItOutEnabled: true,
      syntaxHighlight: true,
    },
  });

  app.useGlobalGuards(
    new SecretKeyGuard(app.get(Reflector), app.get(ConfigService)),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
