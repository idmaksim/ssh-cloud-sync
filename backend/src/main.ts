import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Nest.js Base Template')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

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
    customSiteTitle: 'Nest.js Base Template',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
