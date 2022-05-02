import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import RestaurantInfoForm from "../../components/RestaurantInfoForm/RestaurantInfoForm";
import RestaurantTable from "../../components/RestaurantTable/RestaurantTable";

export default function FrontPage() {
    return (
        <div>
          <h2>Choose your favourite restaurant</h2>
          <RestaurantTable/>
          <h2>Or create new restaurant</h2>
          <RestaurantInfoForm restaurant={{}}/>
        </div>
      );

}