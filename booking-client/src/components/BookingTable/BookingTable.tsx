import * as React from "react";
import { useState } from "react";
import { Button, ButtonGroup, Form, Modal, Table } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Link, Outlet } from "react-router-dom";
import axiosClient from "../../axios";
import Booking from "../../types/Booking";
import BookingFormModal from "../BookingFormModal/BookingFormModal";

function useBookings(id: string | undefined) {
  return useQuery("bookings", async () => {
    const { data } = await axiosClient.get(
      "bookings/?restaurant=" + id
    );
    return data;
  });
};

type BookingProps = { restaurantId: string }
const BookingTable = ({ restaurantId }: BookingProps) => {
  const { status, data, error, isFetching } = useBookings(restaurantId);

  const [showModal, setShowModal] = useState(false);
  const [bookingFormState, setBookingFormState] = useState({} as any);

  const deleteBooking = async (id: string) => {
    const { data: response } = await axiosClient.delete('/bookings/' + id);
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

  const handleCreation = (restaurantId: string) => {
    console.log(restaurantId);
    setShowModal(true);
    setBookingFormState({ restaurant: restaurantId });
  }
  const handleUpdate = (booking: Booking) => {
    console.log("Update booking", booking);
    setShowModal(true);
    setBookingFormState(booking);
  }

  const handleClose = () => {
    setShowModal(false);
    setBookingFormState({});
    console.log("After close", bookingFormState)
  }

  const handleDelete = (id: string) => {
    mutate(id);
  }

  const formatTimeslotToHour = (timeslot: number) => {
    return timeslot < 10 ? `0${timeslot.toString()}:00` : `${timeslot.toString()}:00`;
  }

  const formatDateToYYYYMMDD = (date:Date) => {
    return date ? date.toString().split("T")[0] : ""
  }


  const createBooking = async (data: Booking) => {
    const { data: response } = await axiosClient.post('/bookings', data);
    return response.data;
  };

  const modifyBooking = async (data: Booking) => {
    console.log(data);
    const { data: response } = await axiosClient.put('/bookings/' + bookingFormState._id, data);
    return response.data;
  };

  const { mutate: createMutation, isLoading: isLoadingCreation } = useMutation(createBooking, {
    onSuccess: data => {
      console.log(data);
      const message = "Booking created"
      alert(message);

    },
    onError: () => {
      alert("there was an error")
    }
  });

  const { mutate: updateMutation, isLoading: isLoadingMod } = useMutation(modifyBooking, {
    onSuccess: data => {
      console.log(data);
      const message = "Booking created"
      alert(message);
    },
    onError: () => {
      alert("there was an error")
    }
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setBookingFormState((values: any) => ({ ...values, [name]: value }))
  }

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    console.log(bookingFormState);
    //Update
    if (bookingFormState._id) {
      updateMutation(bookingFormState);
    } else {
      //Create new
      const newBooking = { ...bookingFormState, restaurant: restaurantId }
      console.log(newBooking)
      createMutation(newBooking as any);
    }
    setBookingFormState({});
    setShowModal(false);
  }
  console.log("Date!!!",bookingFormState);
  return (
    <>
      {status === "loading" ? (
        <span>Loading bookings...</span>
      ) : status === "error" ? (
        <span>Ups.. error loading restaurant bookings, please try again</span>
      ) : (
        <>
          <Button onClick={() => { handleCreation(restaurantId) }}>Create new booking</Button>
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
                  <td key={booking._id + "-1"}>{formatDateToYYYYMMDD(booking.date)}</td>
                  <td key={booking._id + "-2"}>{formatTimeslotToHour(booking.timeslot)}</td>
                  <td key={booking._id + "-3"}>{booking.client_name}</td>
                  <td key={booking._id + "-4"}>{booking.customer_nr}</td>
                  <td key={booking._id + "-5"}>{booking.confirmed.toString()}</td>
                  <td key={booking._id + "-6"}>
                    <ButtonGroup>
                      <Button onClick={() => { handleUpdate(booking) as any }}>Update</Button>
                      <Button onClick={() => { handleDelete(booking._id) as any }}>Delete</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}

            </tbody>
          </Table>

          
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form id="booking-form" onSubmit={(e) => onFormSubmit(e)}>
                <Form.Group className="mb-3" controlId="client_name">
                  <Form.Label>Client name</Form.Label>
                  <Form.Control name="client_name" type="text" onChange={handleChange} value={bookingFormState.client_name} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control name="date" type="date" onChange={handleChange} value={formatDateToYYYYMMDD(bookingFormState.date)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="timeslot">
                  <Form.Label>Timeslot</Form.Label>
                  <Form.Control name="timeslot" type="number" onChange={handleChange} value={bookingFormState.timeslot} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="customer_nr">
                  <Form.Label>Number of customers</Form.Label>
                  <Form.Control name="customer_nr" type="number" onChange={handleChange} value={bookingFormState.customer_nr} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" form='booking-form'>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}



    </>


  );

}

export default BookingTable;