import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ModifyRestaurantDto } from './dto/modify-restaurant.dto';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<RestaurantDocument>,
  ) { }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
      this.validateRestaurantDto(createRestaurantDto);
      const createdRte = await this.restaurantModel.create(createRestaurantDto);
      return createdRte;
    
  }

  async update(id: string, modifyRestaurantDto: ModifyRestaurantDto): Promise<Restaurant> {
    if (!ObjectId.isValid(id)) {
      throw Error("Invalid Restaurant ID");
    };
    this.validateRestaurantDto(modifyRestaurantDto);
    const modRte = await this.restaurantModel.findByIdAndUpdate(id, modifyRestaurantDto, { new: true }).exec();
    return modRte;
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant> {
    if (!ObjectId.isValid(id)) {
      throw Error("Invalid Restaurant ID");
    };
    const found = await this.restaurantModel.findOne({ _id: id }).exec();
    return found;
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) {
      return null; // nothing valid to delete
    };
    
    const deletedRte = await this.restaurantModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedRte;
  }

  // Logic backend validations on the Restaurant object before saving to the database
  validateRestaurantDto = (restaurant: CreateRestaurantDto | ModifyRestaurantDto) =>{
    if(restaurant.opening_hour >= restaurant.closing_hour){
      throw Error("Opening hour cannot be equals or after the closing hour");
    }
    if(restaurant.total_tables < 0){
      throw Error("Number of tables needs to be a positive number");
    }
  }
}