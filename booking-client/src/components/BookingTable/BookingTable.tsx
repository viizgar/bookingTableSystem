import * as React from "react";
import { useState } from "react";
import { Button, ButtonGroup, Form, Modal, Table, Toast, ToastContainer } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import axiosClient from "../../axios";
import Booking from "../../types/Booking";
var range = require('lodash/range');

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
  const { status, data } = useBookings(restaurantId);
  const { data: restaurantData} = useQuery("rte", async () => {
  const {data} =  await axiosClient.get(
    "restaurant/" + restaurantId
  )
return data;  
}
);


  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("default");

  const [bookingFormState, setBookingFormState] = useState({} as any);

  const handleCreation = (restaurantId: string) => {
    setShowModal(true);
    setBookingFormState({ restaurant: restaurantId });
  }
  const handleUpdate = (booking: Booking) => {
    setShowModal(true);
    setBookingFormState(booking);
  }

  const handleClose = () => {
    setShowModal(false);
    setBookingFormState({});
  }

  const handleDelete = (id: string) => {
    deleteMutation(id);
  }

  const formatTimeslotToHour = (timeslot: number) => {
    return timeslot < 10 ? `0${timeslot.toString()}:00` : `${timeslot.toString()}:00`;
  }

  const formatDateToYYYYMMDD = (date: Date) => {
    return date ? date.toString().split("T")[0] : ""
  }

  const createBooking = async (booking: Booking) => {
    const { data } = await axiosClient.post('/bookings', booking);
    return data;
  };

  const modifyBooking = async (booking: Booking) => {
    const { data } = await axiosClient.put('/bookings/' + bookingFormState._id, booking);
    return data;
  };

  const deleteBooking = async (id: string) => {
    const { data } = await axiosClient.delete('/bookings/' + id);
    return data;
  };

  const { mutate: deleteMutation } = useMutation(deleteBooking, {
    onSuccess: (res: any) => {
      const message = "Booking deleted successfuly"
      delete data[data.findIndex((e: Booking) => e._id === res._id)];
      toogleToast(message);
    },
    onError: (e: any) => {
      toogleToast("there was an error:" + e.response.data.message);
    }
  });

  const { mutate: createMutation } = useMutation(createBooking, {
    onSuccess: (res: Booking) => {
      const message = "Booking creasted"
      toogleToast(message);
      data.push(res)
    },
    onError: (e: any) => {
      toogleToast("there was an error:" + e.response.data.message);
    }
  });

  const { mutate: updateMutation } = useMutation(modifyBooking, {
    onSuccess: (res: Booking) => {
      const message = "Booking created"
      data[data.findIndex((e: Booking) => e._id === res._id)] = { ...res };
      toogleToast(message);
      console.log(data);

    },
    onError: (e: any) => {
      toogleToast("there was an error:" + e.response.data.message);
    }
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setBookingFormState((values: any) => ({ ...values, [name]: value }))
  }

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    //Update
    if (bookingFormState._id) {
      updateMutation(bookingFormState);
    } else {
      //Create new
      const newBooking = { ...bookingFormState, restaurant: restaurantId }
      createMutation(newBooking as any);
    }
    setBookingFormState({});
    setShowModal(false);
  }

  const toogleToast = (text?: string) => {
    if (showToast) {
      setToastBody("");
      setShowToast(false);
    } else {
      setToastBody(text ? text : "No text provided");
      setShowToast(true);
    }
  }

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
                  <Form.Select required name="timeslot" onChange={handleChange} value={bookingFormState.timeslot}>
                    {[...range(restaurantData.opening_hour, restaurantData.closing_hour)].map((x, i) =>
                      x < 10 ? <option key={"opt-" + x} value={i}>0{x}:00</option> : <option key={"opt-" + x} value={x}>{x}:00</option>
                    )}
                  </Form.Select>
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
          <ToastContainer position='top-end'>
            <Toast show={showToast} onClose={() => toogleToast()} delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">Booking updated!!</strong>
              </Toast.Header>
              <Toast.Body>{toastBody}</Toast.Body>
            </Toast>
          </ToastContainer>
        </>
      )}
    </>
  );
}

export default BookingTable;