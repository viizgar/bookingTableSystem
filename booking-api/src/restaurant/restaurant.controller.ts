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
    try{
      return await this.restaurantService.create(createRestaurantDto);
    }catch(e){
      throw new BadRequestException(e.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() modifyRestaurantDto: ModifyRestaurantDto) {
    try{
      const res =  await this.restaurantService.update(id, modifyRestaurantDto);
      if(res === null) { throw new NotFoundException() };
      return res;
    }catch(e){
      if(e instanceof NotFoundException ) {
        throw e};
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    try{
    const res = await this.restaurantService.findOne(id);
    if(res === null) { throw new NotFoundException() };
    return res;
  }catch(e){
    throw new NotFoundException()
  }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.restaurantService.delete(id); 
  }
}