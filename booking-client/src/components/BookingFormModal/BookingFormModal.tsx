import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import axiosClient from "../../axios";
import Booking from "../../types/Booking";

export default function BookingFormModal({ restaurantId, selectedBooking, show, handleUpdate, handleClose }: any) {


  const [bookingFormState, setBookingFormState] = useState(selectedBooking);


  const createBooking = async (data: Booking) => {
    const { data: response } = await axiosClient.post('/bookings', data);
    return response.data;
  };

  const modifyBooking = async (data: Booking) => {
    console.log(data);
    const { data: response } = await axiosClient.put('/bookings/' + selectedBooking._id, data);
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
      const newBooking = {...bookingFormState, restaurant: restaurantId}
      console.log(newBooking)
      createMutation(newBooking as any);
      setBookingFormState({});
      event.target.reset();
    }

  }

  return (
    <Modal show={show} onHide={handleClose}>
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
            <Form.Control name="date" type="date" onChange={handleChange} value={bookingFormState.date} />
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

  );
}
