import { ApiProperty } from "@nestjs/swagger";

export class CreateRestaurantDto {
  @ApiProperty()    
  readonly name: string;
  @ApiProperty()
  readonly owner: string;
  @ApiProperty()
  readonly opening_hour: number;
  @ApiProperty()
  readonly closing_hour: number;
  @ApiProperty()
  readonly total_tables: number;
}