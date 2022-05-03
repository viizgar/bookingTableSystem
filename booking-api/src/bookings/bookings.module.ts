import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Restaurant, RestaurantSchema } from 'src/restaurant/schemas/restaurant.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }, { name: Restaurant.name, schema: RestaurantSchema } ])],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
