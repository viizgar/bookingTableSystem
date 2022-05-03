import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantSchema,
} from 'src/restaurant/schemas/restaurant.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

const mockRestaurant = {
  _id: '626f9547ce9c7383a490f78e', // valid id format
  name: 'Restaurant #test',
  owner: 'Mr Testar',
  opening_hour: 8, // valid opening <= closing
  closing_hour: 20, // valid closing >= opening
  total_tables: 10, // valid > 1
};

const mockValidBooking = {
  _id: '626f9547ce9c7383a490f78e',
  restaurant: '626f9547ce9c7383a490f78e', // valid id format
  client_name: 'Client #1',
  date: new Date('2022-05-02T08:49:33.843Z'),
  timeslot: 10, // valid timeslot (opening <= timeslot >= closing)
  customer_nr: 1, // valid > 0
  confirmed: true,
};

const mockValidBookingArray = [
  { ...mockValidBooking },
  { ...mockValidBooking, client_name: 'Client #2' },
];

const mockBadBooking = {
  client_name: 'Client #1',
  date: new Date('2022-05-02T08:49:33.843Z'),
  timeslot: 3,
  customer_nr: 1,
  confirmed: true,
};

describe('BookingsService', () => {
  let service: BookingsService;
  let model: Model<Booking>;
  let mockRteModel: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getModelToken('Booking'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockValidBooking),
            constructor: jest.fn().mockResolvedValue(mockValidBooking),
            find: jest.fn(),
            findOne: jest.fn(),
            aggregate: jest.fn(),
            create: jest.fn().mockResolvedValue(mockValidBooking),
            exec: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            countDocuments: jest.fn().mockResolvedValue(1),
          },
        },
        {
          provide: getModelToken('Restaurant'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn().mockResolvedValue(mockRestaurant),
            findOne: jest.fn().mockResolvedValue(mockRestaurant),
            create: jest.fn().mockResolvedValue(mockRestaurant),
            exec: jest.fn(),
            findById: jest.fn().mockResolvedValue(mockRestaurant),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockRestaurant),
            findByIdAndRemove: jest.fn().mockResolvedValue(mockRestaurant),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    model = module.get<Model<Booking>>(getModelToken(Booking.name));
    mockRteModel = module.get<Model<Restaurant>>(
      getModelToken(Restaurant.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const newBooking = await service.create({ ...mockValidBooking });
      expect(newBooking).toEqual(mockValidBooking);
    });

    it('should fail with a bad model booking', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject());

      expect(
        service.create({ ...(mockBadBooking as any) }),
      ).rejects.toBeInstanceOf(Error);
    });
    it('should fail if the restaurant is closed', async () => {
      expect(
        service.create({
          ...mockValidBooking,
          timeslot: 23, // mocked rte close at 20h
        }),
      ).rejects.toBeInstanceOf(Error);
    });
    it('should fail if the number of customers is <1', async () => {
      expect(
        service.create({
          ...mockValidBooking,
          customer_nr: 0, // should be >= 1
        }),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('findAll', () => {
    it('should return an array of bookings from the DB', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockValidBookingArray),
      } as any);
      const newBookingArray = await service.findMany(mockRestaurant._id);
      expect(newBookingArray).toEqual(mockValidBookingArray);
    });
    it('should return error if parameters are incorrect', async () => {
      jest.spyOn(model, 'find').mockRejectedValue(new Error());
      expect(
        service.findMany(mockRestaurant._id, 'fake'),
      ).rejects.toThrowError();
    });
  });

  describe('find Unique', () => {
    it('should return an unique booking by id', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockValidBooking),
      } as any);
      expect(await service.findOne(mockValidBooking._id)).toEqual(
        mockValidBooking,
      );
    });

    it('should return null if id requested is not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      expect(service.findOne(mockValidBooking._id)).resolves.toEqual(null);
    });

    it('should return null if id requested is not valid', async () => {
      expect(service.findOne('fakeId')).resolves.toEqual(null);
    });
  });

  describe('update', () => {
    it('should update the requested id booking', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockValidBooking),
      } as any);

      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValueOnce([mockValidBooking]),
      } as any);

      const updatedMockBooking = {
        ...mockValidBooking,
        customer_nr: 5,
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedMockBooking),
      } as any);

      expect(
        await service.update(mockValidBooking._id, updatedMockBooking),
      ).toEqual(updatedMockBooking);
    });
    it('should return null if booking not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const updatedMockBooking = {
        ...mockValidBooking,
        customer_nr: 5,
      };

      expect(
        await service.update(mockValidBooking._id, updatedMockBooking),
      ).toBeNull();
    });

    it('should fail if payload is bad formed', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockValidBooking),
      } as any);

      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValueOnce([mockValidBooking]),
      } as any);

      const updatedMockBooking = {
        ...mockValidBooking,
        customer_nr: 5,
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(
        await service.update(mockValidBooking._id, updatedMockBooking),
      ).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete the requested booking by id', async () => {
      jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockValidBooking),
      } as any);
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValueOnce([mockValidBooking]),
      } as any);
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      const deletedRte = await service.delete(mockValidBooking._id);
      expect(deletedRte).toEqual(mockValidBooking);
    });
    it('should return null if the resource is not found', async () => {
      jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValueOnce([mockValidBooking]),
      } as any);
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      const deletedRte = await service.delete(mockValidBooking._id);
      expect(deletedRte).toBeNull();
    });
    it('should return null if the resource id is not correct', async () => {
      const deletedRte = await service.delete('fakeId');
      expect(deletedRte).toBeNull();
    });
  });

  describe('find dailyFullTimeslots', () => {
    it('should return an array of numbers indicating full timeslots', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValueOnce([
        { _id: 10, bookings: 1 },
        { _id: 11, bookings: 99 },
        { _id: 12, bookings: 99 },
      ]);
      // timeslots 11 and 12 are full (bookings > table_nr). Timeslot 10 not.
      expect(
        await service.findFullyBookedSlots(
          mockValidBooking.restaurant,
          mockValidBooking.date.toString(),
        ),
      ).toStrictEqual([11, 12]);
    });
    it('should return null if restaurant id is not correct', async () => {
      expect(
        await service.findFullyBookedSlots(
          'fakeId',
          mockValidBooking.date.toString(),
        ),
      ).toBeNull();
    });
    it('should fail if date is not correct', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValueOnce([
        { _id: 10, bookings: 1 },
        { _id: 11, bookings: 99 },
        { _id: 12, bookings: 99 },
      ]);
      expect(
        service.findFullyBookedSlots(mockValidBooking.restaurant, 'fakeDate'),
      ).rejects.toThrowError();
    });
  });
});
