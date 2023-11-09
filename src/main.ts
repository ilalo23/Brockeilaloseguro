import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express";

import  helmet from "helmet";
import * as compression from "compression";
import { ValidationPipe } from "@nestjs/common";
import  * as mongoose from "mongoose";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.disable('x-powered-by');
  await app.listen(3800);

  app.use(helmet());
  app.use(compression());
  mongoose.set("debug", true);
}
bootstrap();
