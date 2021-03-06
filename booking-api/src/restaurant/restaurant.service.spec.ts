import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';

const mockRte = {
  name: 'Restaurant #test',
  owner: 'Mr Testar',
  opening_hour: 9,
  closing_hour: 20,
  total_tables: 10,
};

const mockModRte = {
  name: 'mod restaurant',
  owner: 'owner',
  opening_hour: 9,
  closing_hour: 20,
  total_tables: 10,
};

describe('RestaurantService', () => {
  let service: RestaurantService;
  let model: Model<Restaurant>;

  const rteArray = [
    {
      name: 'Restaurant #test',
      owner: 'Mr Testar',
      opening_hour: 9,
      closing_hour: 20,
      total_tables: 10,
    },
    {
      name: 'Restaurant #test2',
      owner: 'Ms Testi',
      opening_hour: 9,
      closing_hour: 12,
      total_tables: 5,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getModelToken('Restaurant'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockRte),
            constructor: jest.fn().mockResolvedValue(mockRte),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    model = module.get<Model<Restaurant>>(getModelToken('Restaurant'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find Many', () => {
    it('should return all restaurants', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(rteArray),
      } as any);
      const rtes = await service.findAll();
      expect(rtes).toEqual(rteArray);
    });
  });

  describe('find Unique', () => {
    it('should return a single restaurant by id', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(rteArray[0]),
      } as any);
      const rte = await service.findOne('626d48eeb97e6bbcf0dddf22');
      expect(rte).toEqual(rteArray[0]);
    });
  });

  describe('creation', () => {
    it('should insert a new restaurant', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRte));
      const newRte = await service.create({
        name: 'new restaurant',
        owner: 'owner',
        opening_hour: 9,
        closing_hour: 20,
        total_tables: 10,
      });
      expect(newRte).toEqual(mockRte);
    });

    it('should fail to insert a new bad format restaurant', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('incorrect model')),
        );
     
      expect(service.create({
        name: 'new restaurant',
        owner: 'owner',
      } as any)).rejects.toBeInstanceOf(Error);
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockModRte),
      } as any);
      const modRte = await service.update('626d48eeb97e6bbcf0dddf22', {
        name: 'mod restaurant',
        owner: 'owner',
        opening_hour: 9,
        closing_hour: 20,
        total_tables: 10,
      });
      expect(modRte).toEqual(mockModRte);
    });

    it('should fail to update with a bad restaurant model', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      const modRte = await service.update('626d48eeb97e6bbcf0dddf22', {
        name: 'mod restaurant',
        owner: 'owner',
        opening_hour: 9,
        closing_hour: 20,
        total_tables: 10,
      });
      expect(modRte).toEqual(null);
    });

    it('Should not update unexistant restaurant', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      const modRte = await service.update('626d48eeb97e6bbcf0dddf22', {
        name: 'mod restaurant',
        owner: 'owner',
        opening_hour: 9,
        closing_hour: 20,
        total_tables: 10,
      });

      expect(modRte).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a restaurant', async () => {
      jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockModRte),
      } as any);
      const deletedRte = await service.delete('626d48eeb97e6bbcf0dddf22');
      expect(deletedRte).toEqual(mockModRte);
    });

    it('should throw error to a bad formed id', async () => {
      expect(service.delete('fakeId')).resolves.toBeNull();
    });
  });
});
