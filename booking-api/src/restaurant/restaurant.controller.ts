import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { ModifyRestaurantDto} from './dto/modify-restaurant.dto';
import { CreateRestaurantDto} from './dto/create-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const res = await this.restaurantService.create(createRestaurantDto);
    if(res === null) { throw new BadRequestException() };
    return res;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() modifyRestaurantDto: ModifyRestaurantDto) {
    const res = await this.restaurantService.update(id, modifyRestaurantDto);
    if(res === null) { throw new NotFoundException() };
    return res;
  }

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    const res = await this.restaurantService.findOne(id);
    console.log(res);
    if(res === null) { throw new NotFoundException() };
    return res;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.restaurantService.delete(id);
  }
}