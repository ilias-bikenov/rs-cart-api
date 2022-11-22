import { NestFactory } from '@nestjs/core';

import { Callback, Context, Handler } from 'aws-lambda';
import helmet from 'helmet';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from './app.module';
import { CorsHeaderInterceptor } from './corsInterceptor';

let server: Handler;
async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  app.useGlobalInterceptors(new CorsHeaderInterceptor());
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
