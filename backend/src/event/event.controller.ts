import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.getAllEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  @Post('verify')
  verify(@Body() payload: any) {
    return this.eventService.verifyQRCode(payload);
  }
}
