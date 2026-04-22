import {
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(3)
  location: string;

  @IsNumber()
  @IsPositive()
  ticketPrice: number;
}
