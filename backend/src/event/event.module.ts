import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { QrService } from '../qr/qr.service';

@Module({
  controllers: [EventController],
  providers: [EventService, QrService],
})
export class EventModule {}
