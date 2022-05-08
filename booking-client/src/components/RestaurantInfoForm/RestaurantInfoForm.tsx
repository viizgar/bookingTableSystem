import * as React from "react";
import { useState } from "react";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";
import axiosClient from "../../axios";
import { useMutation } from 'react-query';
import Restaurant from "../../types/Restaurant";



export default function RestaurantInfoForm(props: { restaurant: any; }) {
  const [restaurantFormState, setRestaurantFormState] = useState(props.restaurant);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("default");

  const toogleToast = (text?: string) => {
    if (showToast) {
      setToastBody("");
      setShowToast(false);
    } else {
      setToastBody(text ? text : "No text provided");
      setShowToast(true);
    }
  }

  const createRestaurant = async (data: Restaurant) => {
    const { data: response } = await axiosClient.post('/restaurant', data);
    return response.data;
  };

  const updateRestaurant = async (data: Restaurant) => {
    const { data: response } = await axiosClient.put('/restaurant/' + props.restaurant._id, data);
    return response.data;
  };

  const { mutate: createMutation } = useMutation(createRestaurant, {
    onSuccess: data => {
      const message = "Restaurant created"
      toogleToast(message);

    },
    onError: (e: any) => {
      toogleToast("there was an error:" + e.response.data.message);
    }
  });

  const { mutate: updateMutation } = useMutation(updateRestaurant, {
    onSuccess: data => {
      const message = "Restaurant modified"
      toogleToast(message);
    },
    onError: (e: any) => {
      toogleToast("there was an error:" + e.response.data.message);
    }
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setRestaurantFormState((values: any) => ({ ...values, [name]: value }))
  }

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    //Update
    if (props.restaurant._id) {
      updateMutation(restaurantFormState);
    } else {
      //Create new
      createMutation(restaurantFormState);
      setRestaurantFormState({});
      event.target.reset();
    }

  }

  return (
    <>
    <div className="restaurantForm">
      <Form onSubmit={(e) => onFormSubmit(e)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control required name="name" type="text" onChange={handleChange} value={restaurantFormState.name} />
          <Form.Control.Feedback type="invalid">
            Please insert a restaurant name.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="owner">
          <Form.Label>Owner</Form.Label>
          <Form.Control required name="owner" type="text" onChange={handleChange} value={restaurantFormState.owner} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="opening_hour">
          <Form.Label>Opening Hour</Form.Label>
          <Form.Select required name="opening_hour" onChange={handleChange} value={restaurantFormState.opening_hour}>
            {[...Array(24)].map((x, i) =>
                      i < 10 ? <option key={"opt-"+i} value={i}>0{i}:00</option> : <option key={"opt-"+i} value={i}>{i}:00</option>
                      )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="closing_hour">
          <Form.Label>Closing Hour</Form.Label>
          <Form.Select required name="closing_hour" onChange={handleChange} value={restaurantFormState.closing_hour}>
            {[...Array(24)].map((x, i) =>
                      i < 10 ? <option key={"opt-"+i} value={i}>0{i}:00</option> : <option key={"opt-"+i} value={i}>{i}:00</option>
                      )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="total_tables">
          <Form.Label>Number of tables</Form.Label>
          <Form.Control required name="total_tables" type="number" onChange={handleChange} value={restaurantFormState.total_tables} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
    <ToastContainer position='top-end'>
            <Toast show={showToast} onClose={() => toogleToast()} delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">Restaurant updated!!</strong>
              </Toast.Header>
              <Toast.Body>{toastBody}</Toast.Body>
            </Toast>
          </ToastContainer>
    </>
  );

}
