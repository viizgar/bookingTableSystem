import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  owner: string;

  @Prop({required: true})
  opening_hour: number;

  @Prop({required: true})
  closing_hour: number;

  @Prop({required: true})
  total_tables: number;

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);