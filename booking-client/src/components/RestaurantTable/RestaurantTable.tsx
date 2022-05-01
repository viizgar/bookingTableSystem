import * as React from "react";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import axiosClient from "../../axios";

function useRestaurants() {
    return useQuery("restaurants", async () => {
        const { data } = await axiosClient.get(
            "restaurant"
        );
        return data;
    });
};

export default function RestaurantTable() {

    const { status, data, error, isFetching } = useRestaurants();

    return (
        <>
            

            {status === "loading" ? (
                <span>Loading restaurant list...</span>
            ) : status === "error" ? (
                <span>Ups.. error loading the restaurant list, please try again</span>
            ) : (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((rte: any) => (
                            <tr>
                                <td>{rte.name}</td>
                                <td>
                                    <Link to={`/admin/${rte._id}`} className="btn btn-primary">Admin</Link>
                                    <Link to={`/bookings/${rte._id}`} className="btn btn-primary">Bookings</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}


        </>
    );

}