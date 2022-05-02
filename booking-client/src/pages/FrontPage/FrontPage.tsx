import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import RestaurantInfoForm from "../../components/RestaurantInfoForm/RestaurantInfoForm";
import RestaurantTable from "../../components/RestaurantTable/RestaurantTable";

export default function FrontPage() {
    return (
        <div className="frontMenuWrapper">
          <div className="subMenu">
          <h2>Choose your favourite restaurant</h2>
          <RestaurantTable/>
          </div>
          <div className="subMenu">
          <h2>Or create a new restaurant</h2>
          <RestaurantInfoForm restaurant={{}}/>
          </div>
        </div>
      );

}