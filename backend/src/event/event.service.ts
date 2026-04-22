import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrService } from '../qr/qr.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qrService: QrService,
  ) {}

  async createEvent(dto: CreateEventDto) {
    // Build the data payload that will be encoded in the QR code
    const qrPayload = {
      title: dto.title,
      date: dto.date,
      location: dto.location,
      ticketPrice: dto.ticketPrice,
    };

    const qrCode = await this.qrService.generateQRCode(qrPayload);

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        date: new Date(dto.date),
        location: dto.location,
        ticketPrice: dto.ticketPrice,
        qrCode,
      },
    });

    return event;
  }

  async getAllEvents() {
    return this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException(`Event with id ${id} not found`);
    return event;
  }

  async deleteEvent(id: string) {
    await this.getEventById(id); // ensure exists
    return this.prisma.event.delete({ where: { id } });
  }

  async verifyQRCode(payload: any) {
    const isValid = this.qrService.verifySignature(payload);
    return {
      isValid,
      message: isValid ? 'Valid ticket' : 'Invalid or tampered ticket',
      data: isValid ? payload : null,
    };
  }
}
