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
    try {
      const createdRte = await this.restaurantModel.create(createRestaurantDto);
      console.log(createdRte);
      return createdRte;
    } catch (e) {
      return null;
    }
  }

  async update(id: string, modifyRestaurantDto: ModifyRestaurantDto): Promise<Restaurant> {
    if (!ObjectId.isValid(id)) {
      return null;
    };

    const modRte = await this.restaurantModel.findByIdAndUpdate(id, modifyRestaurantDto, { new: true }).exec();
    return modRte;
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant> {
    if (!ObjectId.isValid(id)) {
      return null;
    };
    return this.restaurantModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    };
    
    const deletedRte = await this.restaurantModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedRte;
  }
}