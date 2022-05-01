import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from './restaurant/restaurant.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
        authSource: "admin",
        user: process.env.DB_USER,
        pass: process.env.DB_PWD
    }),
    RestaurantModule,
    BookingsModule,
  ],
})
export class AppModule {}