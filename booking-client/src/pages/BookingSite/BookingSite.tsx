import * as React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import RestaurantInfoForm from "../../components/RestaurantInfoForm/RestaurantInfoForm";
import RestaurantTable from "../../components/RestaurantTable/RestaurantTable";

export default function BookingSite() {
    const { id } = useParams()
    console.log(id)

    return (
        <></>

      );

}