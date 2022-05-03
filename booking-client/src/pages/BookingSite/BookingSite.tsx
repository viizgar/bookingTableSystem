import * as React from "react";
import { useParams } from "react-router-dom";
import BookingTable from "../../components/BookingTable/BookingTable";

export default function BookingSite() {
    const { id } = useParams()

    return (
        <div className="adminPanelWrapper">
        <h1>Booking management table</h1>
        <hr></hr>
          <BookingTable restaurantId={id as any}></BookingTable>
        </div>

      );

}