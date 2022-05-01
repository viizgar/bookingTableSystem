import * as React from "react";
import { Link, Outlet } from "react-router-dom";

export default function NotFound() {
    return (
        <div>
          <h2>404 No restaurant here :)</h2>
          <p>
            <Link to="/">Go to the home page</Link>
          </p>
        </div>
      );

}