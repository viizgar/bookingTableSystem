import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockValidBooking),
            findMany: jest.fn().mockResolvedValue(mockValidBookingArray),
            findFullyBookedSlots: jest.fn().mockResolvedValue([10,12]),
            findOne: jest.fn().mockResolvedValue(mockValidBooking),
            update: jest.fn().mockResolvedValue(mockValidBooking),
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
    it('should return the created booking as json', async () => {
      expect(controller.create(mockValidBooking)).resolves.toEqual(mockValidBooking);
      expect(service.create).toHaveBeenCalled();
    })
    it('should throw BadRequestException (http code 409) if data is incorrect', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error());
      expect(controller.create(mockValidBooking)).rejects.toBeInstanceOf(
        BadRequestException);
      expect(service.create).toHaveBeenCalled();
    })
  });

  describe('findMany()', () => {
    it('should return a json array with all found bookings', async () => {
      expect(controller.findMany("mockedId")).resolves.toEqual(mockValidBookingArray);
      expect(service.findMany).toHaveBeenCalled();
    })
    it('should throw BadRequestException (http code 409) if params are incorrect', async () => {
       jest.spyOn(service, 'findMany').mockImplementationOnce(()=> Promise.reject(new Error()));
      expect( controller.findMany("fakeRteId")).rejects.toBeInstanceOf(
        BadRequestException);
      expect(service.findMany).toHaveBeenCalled();
    })
  });

  describe('findOne()', () => {
    it('should return a json object with the booking infos', async () => {
      expect(controller.findOne("mockedId")).resolves.toEqual(mockValidBooking);
      expect(service.findOne).toHaveBeenCalled();
    })
    it('should throw NotFoundException (http code 404) if data is not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementationOnce(()=> null);
      expect(controller.findOne("mockedId")).resolves.toBeNull();
      expect(service.findOne).toHaveBeenCalled();
    })

  });

  describe('findFullyBookedSlots()', () => {
    it('should return an array of integers with all fully booked timeslots', async () => {
      jest.spyOn(service, 'findFullyBookedSlots').mockReturnValueOnce(Promise.resolve([10,11]));
      expect(controller.findFullyBookedSlots(mockValidBooking.restaurant, mockValidBooking.date.toString())).resolves.toEqual([10,11]);
      expect(service.findFullyBookedSlots).toHaveBeenCalled();
    })
    it('should throw NotFoundException (http code 404) if data is not found', async () => {
      jest.spyOn(service, 'findFullyBookedSlots').mockRejectedValueOnce(new Error());
      expect(controller.findFullyBookedSlots(mockValidBooking.restaurant, mockValidBooking.date.toString())).rejects.toBeInstanceOf(
        NotFoundException);
      expect(service.findFullyBookedSlots).toHaveBeenCalled();
    })
  });

  describe('update()', () => {
    it('should return a json object with the updated version of the mod booking', async () => {
      expect(controller.update("mockedId", mockValidBooking)).resolves.toEqual(mockValidBooking);
      expect(service.update).toHaveBeenCalled();
    })
    it('should fail BadRequestException (code 409) with a bad model booking', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());
      expect(controller.update("mockedId", mockValidBooking)).rejects.toBeInstanceOf(
        BadRequestException);
      expect(service.update).toHaveBeenCalled();
    })
  });

  describe('remove()', () => {
    it('should return a 200 response on success', async () => {
      expect(controller.remove("mockedId")).resolves.toEqual(mockValidBooking);
      expect(service.delete).toHaveBeenCalled();
    })
    it('should return a 200 response on not found / bad parameter cases', async () => {
      jest.spyOn(service, 'delete').mockImplementation(() => Promise.reject(new Error()));
      expect(controller.remove("mockedId")).resolves.toBeNull();
      expect(service.delete).toHaveBeenCalled();
    })
  });
});
