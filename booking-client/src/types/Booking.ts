export default interface Booking {
    restaurant: string;
    client_name: string;
    date: Date;
    timeslot: number;
    customer_nr: number;
    confirmed: boolean;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  };