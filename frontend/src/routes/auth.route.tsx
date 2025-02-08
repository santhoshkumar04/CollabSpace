import React from "react";
import { Outlet } from "react-router";

export default function AuthRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
