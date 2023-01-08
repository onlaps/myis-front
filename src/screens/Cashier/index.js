import React from "react";
import { Routes, Route } from "react-router-dom";
import CashierMain from "./screens/Main";
import Shift from "./screens/Shift";
import Booking from "./screens/Booking";
import Order from "./screens/Order";
import Guests from "./screens/Guests";

const Screen = () => {
  return (
    <Routes>
      <Route path="/main" element={<CashierMain />} />
      <Route path="/shift" element={<Shift />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/order" element={<Order />} />
      <Route path="/guests" element={<Guests />} />
    </Routes>
  );
};

export default Screen;
