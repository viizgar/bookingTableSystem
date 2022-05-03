import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;

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
    { ...mockValidBooking, client_name: 'Client #2', _id: "626f9547ce9c7383a490f78l" },
  ];
  
  beforeEach(async () => {
    let service: BookingsService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockValidBookingArray),
            create: jest.fn().mockResolvedValue(mockValidBooking),
            update: jest.fn().mockResolvedValue(mockValidBooking),
            findOne: jest.fn().mockResolvedValue(mockValidBooking),
            delete: jest.fn().mockResolvedValue(mockValidBooking),

          },
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should return the created booking as json', async () => {})
    it('should throw BadRequestException (http code 409) if data is incorrect', async () => {})
  });

  describe('findMany()', () => {
    it('should return a json array with all found bookings', async () => {})
    it('should throw NotFoundException (http code 404) if data is not found', async () => {})
  });

  describe('findOne()', () => {
    it('should return a json object with the booking infos', async () => {})
    it('should throw NotFoundException (http code 404) if data is not found', async () => {})

  });

  describe('findFullyBookedSlots()', () => {
    it('should return an array of integers with all fully booked timeslots', async () => {})
    it('should throw NotFoundException (http code 404) if data is not found', async () => {})
  });

  describe('update()', () => {
    it('should return a json object with the updated version of the mod booking', async () => {})
    it('should fail with a bad model booking', async () => {})
  });

  describe('remove()', () => {
    it('should return a 201 response without body on success', async () => {})
    it('should return a 201 response without body on not found / bad parameter cases', async () => {})
  });
});
