import * as React from "react";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import axiosClient from "../../axios";
import { useForm } from "react-hook-form";
import { useMutation } from 'react-query';
import Restaurant from "../../types/Restaurant";



export default function RestaurantInfoForm() {
    const { register, 
        reset, 
        handleSubmit, 
        formState } = useForm();
    
    const createRestaurant = async (data: Restaurant) => {
        const { data: response } = await axiosClient.post('/restaurant', data);
        return response.data;
      };

    const { mutate, isLoading } = useMutation(createRestaurant, {
        onSuccess: data => {
          console.log(data);
          const message = "Restaurant created"
          alert(message);
          data = null;
        },
        onError: () => {
          alert("there was an error")
        }
      });

    const onFormSubmit  = (data: any) => mutate(data);
    const onErrors = (errors: any) => console.error(errors);
   
    // Clean fields on component rerender
    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset();
        }
      }, [formState, reset]);

    return (
        <div className="restaurantForm">
        <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
        <label>
          Name:
          <input type="text" {...register('name')} />
        </label>
       
        <label>
          Owner name:
          <input type="text" {...register('owner')} />
        </label>
        <label>
          Opening Hour:
          <input type="number" {...register('opening_hour')} />
        </label>
        <label>
          Closing Hour:
          <input type="number" {...register('closing_hour')} />
        </label>
        <label>
          Number of tables:
          <input type="number" {...register('total_tables')} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );

}
