import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Restaurant Controller', () => {
  let controller: RestaurantController;
  let service: RestaurantService;
  const restaurantDto: CreateRestaurantDto = {
    name: 'Restaurant #test',
    owner: 'Mr Testar',
    opening_hour: 9,
    closing_hour: 20,
    total_tables: 10
  };

  const mockRte = {
    name: 'Restaurant #test',
    owner: 'Mr Testar',
    opening_hour: 9,
    closing_hour: 20,
    total_tables: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'Restaurant #test',
                owner: 'Mr Testar',
                opening_hour: 9,
                closing_hour: 20,
                total_tables: 10
              },
              {
                name: 'Restaurant #test2',
                owner: 'Ms Testi',
                opening_hour: 9,
                closing_hour: 12,
                total_tables: 5
              },
            ]),
            create: jest.fn().mockResolvedValue(restaurantDto),
            update: jest.fn().mockResolvedValue(restaurantDto),
            findOne: jest.fn().mockResolvedValue(restaurantDto),
            delete: jest.fn().mockResolvedValue(restaurantDto),

          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  describe('create()', () => {
    it('should create a new restaurant', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(restaurantDto);

      expect(controller.create(restaurantDto)).resolves.toEqual(
        {
          name: 'Restaurant #test',
          owner: 'Mr Testar',
          opening_hour: 9,
          closing_hour: 20,
          total_tables: 10
        }
      )
      expect(service.create).toHaveBeenCalledWith(restaurantDto);
    });

    it('should fail to create a new restaurant with bad model', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(null);

      expect(controller.create({
        name: 'Restaurant #test',
        owner: 'Mr Testar'
      } as any)).rejects.toBeInstanceOf(
        BadRequestException);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should return an array of restaurants', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          name: 'Restaurant #test',
          owner: 'Mr Testar',
          opening_hour: 9,
          closing_hour: 20,
          total_tables: 10
        },
        {
          name: 'Restaurant #test2',
          owner: 'Ms Testi',
          opening_hour: 9,
          closing_hour: 12,
          total_tables: 5
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a restaurant', async () => {
      expect(controller.findOne("mockId")).resolves.toEqual(
        {
          name: 'Restaurant #test',
          owner: 'Mr Testar',
          opening_hour: 9,
          closing_hour: 20,
          total_tables: 10
        });
      expect(service.findOne).toHaveBeenCalled();
    });

    it('should fail with a non existing restaurant id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      expect(controller.findOne("fakeId")).rejects.toBeInstanceOf(
        NotFoundException);
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update a restaurant', async () => {
      controller.update("id", restaurantDto);
      expect(controller.update("626d48eeb97e6bbcf0dddf22", restaurantDto)).resolves.toEqual(
        {
          name: 'Restaurant #test',
          owner: 'Mr Testar',
          opening_hour: 9,
          closing_hour: 20,
          total_tables: 10
        }
      );
      expect(service.update).toHaveBeenCalled();
    });

    it('should reject to update a non existing restaurant', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);
      expect(controller.update("fakeId", restaurantDto)).rejects.toBeInstanceOf(
        NotFoundException);
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should delete an existing restaurant', async () => {

      expect(controller.delete("626d48eeb97e6bbcf0dddf22")).resolves.toEqual(
        {
          name: 'Restaurant #test',
          owner: 'Mr Testar',
          opening_hour: 9,
          closing_hour: 20,
          total_tables: 10
        }
      );
      expect(service.delete).toHaveBeenCalled();
    });
  });
});