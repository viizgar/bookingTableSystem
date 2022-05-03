import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Restaurant, RestaurantDocument } from "src/restaurant/schemas/restaurant.schema";
import { isModuleNamespaceObject } from 'util/types';


@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
  ) { }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    if (!(await this.validateRestaurantReference(createBookingDto.restaurant))) {
      throw Error("Invalid Restaurant id");
    };

    // If no timeslots available, the booking is marked as not confirmed 
    // When a confimed booking changes its timeslot or is deleted, a unconfirmed one takes its place
    const newBookingAttempt: Booking = {
      ...createBookingDto,
      confirmed: await this.areTimeslotAvailable(createBookingDto.restaurant, createBookingDto.date, createBookingDto.timeslot)
    }

    // Validators
    
    // Only attempts within the restaurant working hours are accepted
    if (!await this.isRestaurantOpen(createBookingDto.restaurant, createBookingDto.timeslot)) {
      throw Error("Restaurant closed");
    }

    // >1 customers per table
    if (createBookingDto.customer_nr <= 0) {
      throw Error("At least 1 customer per table needed to make a reservation");
    }

    return await this.bookingModel.create(newBookingAttempt);;
  }


  async findMany(restaurant: string, date?: string, timeslot?: Number): Promise<Booking[]> {
    if (!(await this.validateRestaurantReference(restaurant))) {
      return null // Bad ids will not be found on DB but should not throw errors
    };

    const filter: { [k: string]: any } = { restaurant: restaurant };

    if (date) {
      const dateObj = this.parseDateStringToDateObject(date);

      filter.date = {
        $gte: dateObj.setHours(0, 0, 0),
        $lt: dateObj.setHours(23, 59, 59)
      }
    }

    if (timeslot) {
      filter.timeslot = timeslot;
    }

    return this.bookingModel.find(filter).exec();
  }

  async findFullyBookedSlots(restaurant: string, date: string): Promise<Number[]> {
    if (!(await this.validateRestaurantReference(restaurant))) {
      return null // Bad ids will not be found on DB but should not throw errors
    };
    
    const dateObj = this.parseDateStringToDateObject(date);
    
    const { total_tables, closing_hour, opening_hour } = await this.restaurantModel.findById(restaurant);
    const fullyBookedSlots = [];
    let hourlySlots: number = closing_hour - opening_hour;

    if (hourlySlots > 0) {
      const agg = await this.bookingModel.aggregate([
        { $match : { date : new Date(date) } } ,
          {$group: {
            _id: '$timeslot',
            bookings: { "$sum": 1 }
          }
        }
      ])

      agg.forEach((value: any) => {
        const { _id, bookings } = value;
        const timeslot: any = _id;
        console.log("value.bookings", value.bookings);
        console.log("timeslot", timeslot);

        if (value.bookings >= total_tables) {
          fullyBookedSlots.push(timeslot);
        }
      })
      console.log("fullyBookedSlots", fullyBookedSlots);

    }

    return fullyBookedSlots;

  }

  async findOne(id: string): Promise<Booking> {
    if (!ObjectId.isValid(id)) {
      return null // Bad ids will not be found on DB but should not throw errors
    };
    return this.bookingModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    if (!ObjectId.isValid(id)) {
      return null // Bad ids will not be found on DB but should not throw errors
    };

    // Validators

    // Only attempts within the restaurant working hours are accepted
    const originalBooking: Booking = await this.bookingModel.findById(id).exec();

    // Booking not exists
    if(originalBooking === null){
      return null;
    }

    if (updateBookingDto.timeslot && !await this.isRestaurantOpen(originalBooking.restaurant, updateBookingDto.timeslot)) {
      throw Error("Restaurant closed");
    }

    // >1 customers per table
    if (updateBookingDto.customer_nr && updateBookingDto.customer_nr <= 0) {
      throw Error("At least 1 customer per table needed to make a reservation");
    }

    const modBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();

    // on success
    if(modBooking){
    //In case the date or timeslot changes and it was full, a non-confirmed booking can take its place
    this.placePendingBooking(modBooking.restaurant, modBooking.date, modBooking.timeslot);
    }
    return modBooking;
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) {
      return null // Bad ids will not be found on DB but should not throw errors
    };

    const deletedBooking = await this.bookingModel
      .findByIdAndRemove({ _id: id })
      .exec();

    //In case the timeslot was full, a non-confirmed booking can take its place
    if (deletedBooking) { this.placePendingBooking(deletedBooking.restaurant, deletedBooking.date, deletedBooking.timeslot); }
    return deletedBooking;
  }

  // helpers
  async validateRestaurantReference(restaurant: string): Promise<Boolean> {
    console.log("restaurant", restaurant);
    if (ObjectId.isValid(restaurant)) {
      if (await this.restaurantModel.findById(restaurant)) {
        return true;
      }
    };
    return false;
  }

  parseDateStringToDateObject(dateString: string): Date {
    const dateObj = new Date(dateString);
    console.log(dateObj);
    if (dateObj instanceof Date && isNaN(dateObj.valueOf())) {
      //invalid date
      throw Error("invalid date")
    }

    return dateObj;
  }

  async isRestaurantOpen(restaurant: String, timeslot: number): Promise<Boolean> {
    const { opening_hour, closing_hour } = await this.restaurantModel.findById(restaurant);
    return timeslot >= opening_hour && timeslot <= closing_hour;
  }

  async areTimeslotAvailable(restaurant: String, date: Date, timeslot: Number): Promise<boolean> {

    const { total_tables } = await this.restaurantModel.findById(restaurant);

    const busyTableCount = await this.bookingModel.countDocuments({
      date: {
        $gte: new Date(date).setHours(0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59)
      },
      timeslot
    });

    return total_tables > busyTableCount;
  }

  async placePendingBooking(restaurant: String, date: Date, timeslot: Number): Promise<void> {
    const pendentBookings: BookingDocument[] = await this.bookingModel.find({
      date,
      timeslot,
      confirmed: false
    }).sort('createdAt');
    if (this.areTimeslotAvailable(restaurant, date, timeslot) && pendentBookings.length > 0) {
      const firstBooking: BookingDocument = pendentBookings[0];
      await this.bookingModel.findByIdAndUpdate(firstBooking._id, { confirmed: true }).exec();
    }
  }

}

