import { Controller, Get, Post, Body, Put, Param, Delete, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    try{
      return await this.bookingsService.create(createBookingDto);
    } catch(e){
      throw new BadRequestException(e.message);
    }
  }

  @ApiQuery({
    name: "date",
    type: String,
    description: "Timestamp of the booking (YYYY-MM-DD)",
    required: false
  })
  @ApiQuery({
    name: "timeslot",
    type: Number,
    description: "Timeslot of the booking",
    required: false
  })
  @Get()
  async findMany(
    @Query('restaurant') restaurant: string, 
    @Query('date') date?: string, 
    @Query('timeslot') timeslot?: Number,
    ) {
      try{
        return await this.bookingsService.findMany(restaurant, date, timeslot);
      }catch(e){
        throw new BadRequestException(e.message);
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try{
      return await this.bookingsService.findOne(id);
    }catch(e){
      throw new BadRequestException(e.message);
    }
  }

  @Get('/dailyFullTimeslots/:restaurant/:date')
  async findFullyBookedSlots(
    @Param('restaurant') restaurant: string, 
    @Param('date') date: string, 
  ) {
    try{
      return await this.bookingsService.findFullyBookedSlots(restaurant, date);
    }catch(e){
      // If params are incorrect 404 is returned (no resources found with inputed params)
      throw new NotFoundException(e.message);
    }
    
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    try{
      return await this.bookingsService.update(id, updateBookingDto);
    }catch(e){
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
      return await this.bookingsService.delete(id);
    }catch(e){
      return null;
    }
  }
}
