import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleCloudController } from './google-cloud.controller';
import { GoogleCloudService } from './google-cloud.service';
import { GoogleSheetsBuffer } from './entities/google-sheets-buffer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleSheetsBuffer])],
  controllers: [GoogleCloudController],
  providers: [GoogleCloudService],
  exports: [TypeOrmModule],
})
export class GoogleCloudModule {}
