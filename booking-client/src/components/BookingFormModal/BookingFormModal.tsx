import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import axiosClient from "../../axios";
import Booking from "../../types/Booking";

export default function BookingFormModal({selectedBooking, show, handleUpdate, handleClose} : any) {
  const { register, 
    reset, 
    handleSubmit, 
    formState } = useForm();
    
    const createBooking = async (data: Booking) => {
      const { data: response } = await axiosClient.post('/bookings', data);
      return response.data;
    };

    const modifyBooking = async (data: Booking) => {
      console.log(data);
      const { data: response } = await axiosClient.put('/bookings/'+selectedBooking._id, data);
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

    const { mutate: modMutation, isLoading: isLoadingMod } = useMutation(modifyBooking, {
      onSuccess: data => {
        console.log(data);
      },
      onError: () => {
        alert("there was an error")
      }
    });

  const onFormSubmit  = (data: any) => () => {
    console.log("Submit", data);
    modMutation(data);
  }

    const onErrors = (errors: any) => console.error(errors);

   const formatDate = (date : Date) => {
      console.log(date);
      return date ? date.toString().split("T")[0] : "";
   }

    console.log("SelectedBooking", selectedBooking);
    return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="bookingForm">
        <form id='booking-form' onSubmit={handleSubmit(onFormSubmit, onErrors)}>
        <label>
          Client name:
          <input type="text" {...register('client_name')} value={selectedBooking.client_name}/>
        </label>
       
        <label>
          Date:
          <input type="date" {...register('date')} value={formatDate(selectedBooking.date)}/>
        </label>
        <label>
          Timeslot:
          <input type="number" {...register('timeslot')} value={selectedBooking.timeslot}/>
        </label>
        <label>
          Number of customers:
          <input type="number" {...register('customer_nr')} value={selectedBooking.customer_nr}/>
        </label>
      </form>
      </div>
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
  