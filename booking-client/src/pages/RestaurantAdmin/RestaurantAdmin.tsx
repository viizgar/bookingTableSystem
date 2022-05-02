import * as React from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, Outlet, useParams } from "react-router-dom";
import Restaurant from "../../types/Restaurant";
import axiosClient from "../../axios";
import RestaurantInfoForm from "../../components/RestaurantInfoForm/RestaurantInfoForm";
import BookingTable from "../../components/BookingTable/BookingTable";

function useRestaurant(id: string | undefined) {
  return useQuery("restaurant", async () => {
    const { data } = await axiosClient.get(
      "restaurant/"+id
    );
    return data;
  });
};

export default function RestaurantAdmin() {
  const { id } = useParams()
  const { status, data, error, isFetching } = useRestaurant(id);

  return (
    <>
      {status === "loading" ? (
        <span>Loading restaurant...</span>
      ) : status === "error" ? (
        <span>Ups.. error loading the restaurant, please try again</span>
      ) : (
        <div>
          <h1>Welcome to restaurant: {data.name}</h1>
          <h2>Owner:{data.owner}</h2>
          <hr></hr>
          <h2>Restaurant configuration</h2>
          <RestaurantInfoForm></RestaurantInfoForm>
          <h2></h2>
          <hr></hr>
          <BookingTable restaurantId={id as any}></BookingTable>
        </div>
      )}
    </>
  );
}
