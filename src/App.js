import React from "react";
import { Routes, Route } from "react-router-dom";
import { withAuth } from "./auth";

import "antd/dist/reset.css";
import "./App.less";

import Home from "./screens/Home";
import CashierSelect from "./screens/CashierSelect";
import Cashier from "./screens/Cashier";
import Login from "./screens/Login";
import WarehouseDictionary from "./screens/WarehouseDictionary";
import WarehouseItems from "./screens/WarehouseItems";
import WarehouseActions from "./screens/WarehouseActions";
import MenuDictionary from "./screens/MenuDictionary";
import MenuItems from "./screens/MenuItems";
import EditTeam from "./screens/EditTeam";
import EditRoles from "./screens/EditRoles";
import EditPassword from "./screens/EditPassword";
import EditPlaces from "./screens/EditPlaces";
import EditActions from "./screens/EditActions";
import TeamTime from "./screens/TeamTime";
import TeamSalaries from "./screens/TeamSalaries";
import TeamPayroll from "./screens/TeamPayroll";
import TeamChecklists from "./screens/TeamChecklists";
import FinanceShifts from "./screens/FinanceShifts";
import FinanceSales from "./screens/FinanceSales";
import FinanceExpenses from "./screens/FinanceExpenses";
import FinancePlans from "./screens/FinancePlans";

import GuestCards from "./screens/GuestCards";
import GuestsBooking from "./screens/GuestsBooking";
import GuestsDiscounts from "./screens/GuestsDiscounts";

import NotFound from "./screens/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={withAuth(Home)} />
      <Route path="/cashier-select" element={withAuth(CashierSelect)} />
      <Route path="/cashier/*" element={withAuth(Cashier)} />
      <Route path="/login" element={<Login />} />

      <Route path="/wh-dict" element={withAuth(WarehouseDictionary)} />
      <Route path="/wh-items" element={withAuth(WarehouseItems)} />
      <Route path="/wh-actions" element={withAuth(WarehouseActions)} />

      <Route path="/menu-dict" element={withAuth(MenuDictionary)} />
      <Route path="/menu-items" element={withAuth(MenuItems)} />

      <Route path="/edit-team" element={withAuth(EditTeam)} />
      <Route path="/edit-roles" element={withAuth(EditRoles)} />
      <Route path="/edit-password" element={withAuth(EditPassword)} />
      <Route path="/edit-places" element={withAuth(EditPlaces)} />
      <Route path="/edit-actions" element={withAuth(EditActions)} />

      <Route path="/team-time" element={withAuth(TeamTime)} />
      <Route path="/team-salary" element={withAuth(TeamSalaries)} />
      <Route path="/team-payroll" element={withAuth(TeamPayroll)} />
      <Route path="/team-checklists" element={withAuth(TeamChecklists)} />

      <Route path="/finance-shifts" element={withAuth(FinanceShifts)} />
      <Route path="/finance-sales" element={withAuth(FinanceSales)} />
      <Route path="/finance-expenses" element={withAuth(FinanceExpenses)} />
      <Route path="/finance-plans" element={withAuth(FinancePlans)} />

      <Route path="/guests-cards" element={withAuth(GuestCards)} />
      <Route path="/guests-booking" element={withAuth(GuestsBooking)} />
      <Route path="/guests-discounts" element={withAuth(GuestsDiscounts)} />

      <Route path="*" element={withAuth(NotFound)} />
    </Routes>
  );
};

export default App;
