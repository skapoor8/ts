import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // console.log('endpoint:', process.env.AZURE_COSMOS_DB_ENDPOINT);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
