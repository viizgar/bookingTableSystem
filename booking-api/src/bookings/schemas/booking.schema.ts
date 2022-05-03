import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({timestamps: true})
export class Booking {
  @Prop({required: true})
  @Prop({type: [Types.ObjectId], ref: "Restaurant"})
  restaurant: string;
  
  @Prop({required: true})
  client_name: string;

  @Prop({required: true})
  date: Date;

  @Prop({
    required: true,
    min: 0, // 00:00
    max: 23 // 23:00
  })
  timeslot: number;

  @Prop({
    required: true,
    min: 1,
    max: 999,
  })
  customer_nr: number;

  @Prop({required: true})
  confirmed: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
