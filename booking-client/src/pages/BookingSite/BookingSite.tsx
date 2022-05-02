import * as React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import BookingTable from "../../components/BookingTable/BookingTable";
import RestaurantInfoForm from "../../components/RestaurantInfoForm/RestaurantInfoForm";
import RestaurantTable from "../../components/RestaurantTable/RestaurantTable";

export default function BookingSite() {
    const { id } = useParams()
    console.log(id)

    return (
        <div className="adminPanelWrapper">
        <h1>Booking management table</h1>
        <hr></hr>
          <BookingTable restaurantId={id as any}></BookingTable>
        </div>

      );

}