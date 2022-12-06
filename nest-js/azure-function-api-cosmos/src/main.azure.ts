import { AzureHttpRouter } from '@nestjs/azure-func-http';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createApp(): Promise<INestApplication> {
  // console.log('endpoint:', process.env.AZURE_COSMOS_DB_ENDPOINT);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('');

  await app.init();
  return app;
}
