import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import axiosClient from "../../axios";
import { useForm } from "react-hook-form";
import { useMutation } from 'react-query';
import Restaurant from "../../types/Restaurant";



export default function RestaurantInfoForm(props: { restaurant: any; }) {
  const [restaurantFormState, setRestaurantFormState] = useState(props.restaurant);

  const createRestaurant = async (data: Restaurant) => {
    const { data: response } = await axiosClient.post('/restaurant', data);
    return response.data;
  };

  const updateRestaurant = async (data: Restaurant) => {
    const { data: response } = await axiosClient.put('/restaurant/' + props.restaurant._id, data);
    return response.data;
  };

  const { mutate: createMutation, isLoading: isLoadingCreation } = useMutation(createRestaurant, {
    onSuccess: data => {
      console.log(data);
      const message = "Restaurant created"
      alert(message);
    },
    onError: () => {
      alert("there was an error")
    }
  });

  const { mutate: updateMutation, isLoading: isLoadingUpload } = useMutation(updateRestaurant, {
    onSuccess: data => {
      console.log(data);
      const message = "Restaurant modified"
      alert(message);
    },
    onError: () => {
      alert("there was an error")
    }
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setRestaurantFormState((values: any) => ({ ...values, [name]: value }))
  }

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    console.log(restaurantFormState);
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

  const onErrors = (errors: any) => console.error(errors);

  return (
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
              i < 10 ? <option value={i}>0{i}:00</option> : <option value={i}>{i}:00</option>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="closing_hour">
          <Form.Label>Closing Hour</Form.Label>
          <Form.Select required name="closing_hour" onChange={handleChange} value={restaurantFormState.closing_hour}>
            {[...Array(24)].map((x, i) =>
              i < 10 ? <option value={i}>0{i}:00</option> : <option value={i}>{i}:00</option>
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
  );

}
