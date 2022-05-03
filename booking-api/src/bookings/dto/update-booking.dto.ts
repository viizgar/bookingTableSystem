import { ApiProperty } from "@nestjs/swagger";


export class UpdateBookingDto{
  @ApiProperty()
  readonly client_name: string;
  @ApiProperty()
  readonly date: Date;
  @ApiProperty()
  readonly customer_nr: number;
  @ApiProperty()
  readonly timeslot: number;
}
