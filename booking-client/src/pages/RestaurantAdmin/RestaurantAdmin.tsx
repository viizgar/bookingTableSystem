import * as React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios";
import RestaurantInfoForm from "../../components/RestaurantInfoForm/RestaurantInfoForm";

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
  const { status, data} = useRestaurant(id);

  return (
    <>
      {status === "loading" ? (
        <span>Loading restaurant...</span>
      ) : status === "error" ? (
        <span>Ups.. error loading the restaurant, please try again</span>
      ) : (
        <div className="adminPanelWrapper">
          <h1>Welcome to restaurant: {data.name}</h1>
          <h2>Owner:{data.owner}</h2>
          <hr></hr>
          <h2>Restaurant configuration</h2>
          <RestaurantInfoForm restaurant={data}></RestaurantInfoForm>
        </div>
      )}
    </>
  );
}
