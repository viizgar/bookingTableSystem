import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';
import { Model } from 'mongoose';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/restaurant/schemas/restaurant.schema';
import { RestaurantModule} from "src/restaurant/restaurant.module"
const mockValidBooking = {
  restaurant: '626f9547ce9c7383a490f78d',
  client_name: 'Client #1',
  date: '2022-05-02T08:49:33.843Z',
  timeslot: 3,
  customer_nr: 1,
  confirmed: true,
};

const mockBadBooking = {
  client_name: 'Client #1',
  date: '2022-05-02T08:49:33.843Z',
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
            create: jest.fn(),
            exec: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
        {
          provide: getModelToken('Restaurant'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    model = module.get<Model<Booking>>(getModelToken(Booking.name));
    mockRteModel = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking', async () => {

    });
    it('should fail with a bad model booking', async () => {

    });
    it('should fail if the restaurant is closed', async () => {

    });
    it('should fail if the number of customers is <1', async () => {

    });

  });

  describe('findAll', () => {
    it('should return an array of bookings from the DB', async () => {

    });
  });

  describe('find Unique', () => {
    it('should return an unique booking by id', async () => {});
    it('should return null if id requested is not found', async () => {});
    it('should return null if id requested is not valid', async () => {});
  });

  describe('update', () => {
    it('should update the requested id booking', async () => {});
    it('should return null if booking not found', async () => {});
    it('should fail if payload is bad formed', async () => {});

  });

  describe('delete', () => {
    it('should delete the requested booking by id', async () => {});
    it('should return null if the resource is not found', async () => {});
    it('should return null if the resource id is not correct', async () => {});
  });

  describe('find dailyFullTimeslots', () => {
    it('should return an array of numbers indicating full timeslots', async () => {});
    it('should fail if restaurant id is not correct', async () => {});
    it('should fail if date is not correct', async () => {});

  });
});
