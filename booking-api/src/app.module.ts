import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
        authSource: "admin",
        user: process.env.DB_USER,
        pass: process.env.DB_PWD
    }),
    RestaurantModule,
  ],
})
export class AppModule {}