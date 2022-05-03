import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

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
            create: jest.fn(),
            exec: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    model = module.get<Model<Booking>>(getModelToken('Booking'));
  });

  describe('create', () => {
    it('', async () => {});
  });

  describe('findAll', () => {
    it('', async () => {});
  });

  describe('find Unique', () => {
    it('', async () => {});
  });

  describe('update', () => {
    it('', async () => {});
  });

  describe('delete', () => {
    it('', async () => {});
  });

  describe('find dailyFullTimeslots', () => {
    it('', async () => {});
  });
});
