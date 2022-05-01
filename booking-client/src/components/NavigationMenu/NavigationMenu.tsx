import * as React from "react";
import { Link, Outlet } from "react-router-dom";

export default function NavigationMenu() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>

            <hr />

            <Outlet />
        </div>
    );

}