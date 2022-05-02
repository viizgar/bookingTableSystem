import * as React from "react";
import { useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Link, Outlet } from "react-router-dom";
import axiosClient from "../../axios";
import Booking from "../../types/Booking";
import BookingFormModal from "../BookingFormModal/BookingFormModal";

function useBookings(id: string | undefined) {
    return useQuery("bookings", async () => {
      const { data } = await axiosClient.get(
        "bookings/?restaurant="+id
      );
      return data;
    });
  };

type BookingProps = { restaurantId: string}
const BookingTable= ({restaurantId}: BookingProps) => {
    const { status, data, error, isFetching } = useBookings(restaurantId);

    const [modalState, setModalState] = useState({booking: {}, show: false});

    const deleteBooking = async (id: string) => {
        const { data: response } = await axiosClient.delete('/bookings/'+id);
        return response.data;
      };

    const { mutate, isLoading } = useMutation(deleteBooking, {
        onSuccess: (res: any) => {
          console.log(res);
          const message = "Booking deleted successfuly"
          alert(message);
        },
        onError: () => {
          alert("there was an error")
        }
      });

      const handleUpdate = (booking: Booking) => {
        setModalState({booking: booking, show: true});
        
    }
    const handleClose = (id:string) => {
        setModalState({booking: {}, show: false});
    }

      const handleDelete = (id:string) => {
        mutate(id);
    }

    const formatTimeslotToHour = (timeslot: number) => {
        return timeslot < 10 ? `0${timeslot.toString()}:00` : `${timeslot.toString()}:00`;
    }

    return (
        <>
      {status === "loading" ? (
        <span>Loading bookings...</span>
      ) : status === "error" ? (
        <span>Ups.. error loading restaurant bookings, please try again</span>
      ) : (
        <Table responsive>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Timeslot</th>
                    <th>Book name</th>
                    <th>Customers</th>
                    <th>Confirmed</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                
                {data.map((booking: Booking) => (
                    <tr key={booking._id}>
                                <td key={booking._id+"-1"}>{booking.date.toString().split("T")[0]}</td>
                                <td key={booking._id+"-2"}>{formatTimeslotToHour(booking.timeslot)}</td>
                                <td key={booking._id+"-3"}>{booking.client_name}</td>
                                <td key={booking._id+"-4"}>{booking.customer_nr}</td>
                                <td key={booking._id+"-5"}>{booking.confirmed.toString()}</td>
                                <td key={booking._id+"-6"}>
                                <ButtonGroup>
                                    <Button onClick={() => {handleUpdate(booking) as any}}>Update</Button>
                                    <Button onClick={() => {handleDelete(booking._id) as any}}>Delete</Button>
                                </ButtonGroup>
                                </td>
                                </tr>
                        ))}
                
            </tbody>
        </Table>

      )}

<BookingFormModal selectedBooking={modalState.booking} show={modalState.show} handleUpdate={handleUpdate} handleClose={handleClose}/>

    </>
        
        
    );

}

export default BookingTable;