import { ApiProperty } from "@nestjs/swagger";

export class CreateBookingDto {
  @ApiProperty()    
  readonly restaurant: string;
  @ApiProperty()
  readonly client_name: string;
  @ApiProperty()
  readonly date: Date;
  @ApiProperty()
  readonly timeslot: number;
  @ApiProperty()
  readonly customer_nr: number;
}
