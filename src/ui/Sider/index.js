import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { HomeOutlined, DesktopOutlined } from "@ant-design/icons";
import { ContactsOutlined, ExportOutlined } from "@ant-design/icons";
import { TeamOutlined, DollarOutlined } from "@ant-design/icons";
import { FileMarkdownOutlined, SettingOutlined } from "@ant-design/icons";
import { ContainerOutlined, BarChartOutlined } from "@ant-design/icons";
import { LOGOUT, SET_APP } from "@/actions/app";
import "./index.less";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import useAccesses from "@/hooks/useAccesses";

const { Sider } = Layout;

const getItem = (label, key, icon, children, accesses) => ({
  label,
  key,
  icon,
  children,
  accesses,
});

const items = [
  getItem("Главная", "/", <HomeOutlined />, null, ["main"]),
  getItem("Экран кассира", "/cashier-select", <DesktopOutlined />),
  getItem("Гости и акции", "/guests", <ContactsOutlined />, [
    getItem("Карта гостя", "/guests-cards", null, null, [
      "guest_card",
      "guest_card_sources",
      "guest_card_statistic",
    ]),
    getItem("Бронирование", "/guests-booking", null, null, [
      "guest_booking",
      "guest_card_rooms_tables",
      "guest_card_booking_statistic",
    ]),
    getItem("Скидки", "/guests-discounts", null, null, [
      "guest_discounts",
      "guest_card_promocodes",
    ]),
  ]),
  getItem("Сотрудники", "/team", <TeamOutlined />, [
    getItem("График работы", "/team-time", null, null, [
      "team_time_shift",
      "team_time_employee",
    ]),
    getItem("Зарплаты и планы", "/team-salary", null, null, [
      "team_salary",
      "team_salary_plans",
    ]),
    getItem("Расчет зарплаты", "/team-payroll", null, null, ["team_payroll"]),
    getItem("Чек-листы смен", "/team-checklists", null, null, ["checklists"]),
  ]),
  getItem("Финансы", "/finance", <DollarOutlined />, [
    getItem("История смен", "/finance-shifts", null, null, [
      "shifts",
      "shift_cash",
    ]),
    getItem("История продаж", "/finance-sales", null, null, ["sales"]),
    getItem("Расходы", "/finance-expenses", null, null, [
      "expenses, expense_categories",
    ]),
    getItem("Тарифы оплаты времени", "/finance-plans", null, null, [
      "tariffs, tariffs_statistics",
    ]),
  ]),
  getItem("Меню", "/menu", <FileMarkdownOutlined />, [
    getItem("Справочники", "/menu-dict", null, null, ["menu_dictionary"]),
    getItem("Пункты меню", "/menu-items", null, null, ["menu_items"]),
  ]),
  getItem("Склад", "/wh", <ContainerOutlined />, [
    getItem("Справочники", "/wh-dict", null, null, [
      "wh_categories",
      "wh_units",
      "wh_reasons",
    ]),
    getItem("Товары", "/wh-items", null, null, ["wh_items"]),
    getItem("Движение товара", "/wh-actions", null, null, ["wh_actions"]),
  ]),
  getItem("Статистика", "/stat", <BarChartOutlined />, [
    getItem("Финансы", "/stat-finance", null, null, ["stat_finance"]),
    getItem("Продажи", "/stat-sales", null, null, ["stat_sales"]),
    getItem("ABC – Анализ", "/stat-abc", null, null, ["stat_abc"]),
    getItem("Скидки", "/stat-disc", null, null, ["stat_discounts"]),
    getItem("Расходы", "/stat-month", null, null, ["stat_expenses"]),
    getItem("Посещаемость", "/stat-visits", null, null, ["stat_visits"]),
  ]),
  getItem("Настройки", "/edit", <SettingOutlined />, [
    getItem("Сотрудники", "/edit-team", null, null, ["edit_users"]),
    getItem("Роли", "/edit-roles", null, null, ["edit_roles"]),
    getItem("Сменить пароль", "/edit-password"),
    getItem("Торговые точки", "/edit-places", null, null, ["edit_places"]),
    getItem("История действий", "/edit-actions", null, null, ["edit_history"]),
  ]),
  getItem("Выход", "/logout", <ExportOutlined />),
];

const Comp = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.app.collapsed || false);
  const user = useSelector((state) => state.app.user);

  const path = pathname.split("/")[1];

  const onClick = ({ key }) => {
    try {
      if (key === "/logout") {
        console.log("logging out");
        LOGOUT();
        navigate("/login");
      } else {
        navigate(key);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const parentKey = path.split("-");
  let openKeys = [];
  if (parentKey.length > 1) {
    const item = items.filter((item) => item.key === "/" + parentKey[0]);
    if (item.length) {
      openKeys.push(item[0].key);
    }
  }

  const onCollapse = (v) => {
    dispatch(SET_APP(["collapsed"], v));
  };

  //full and view
  const accesses = useAccesses();

  const getItems = () => {
    const data = [];
    window.defaultPath = null;
    items.forEach((o) => {
      const children = [];
      if (!_.isEmpty(o.children)) {
        o.children.forEach((child) => {
          if (!child.accesses) {
            if (!window.defaultPath) {
              window.defaultPath = child.key;
            }
            children.push(child);
          } else if (_.intersection(child.accesses, accesses).length > 0) {
            if (!window.defaultPath) {
              window.defaultPath = child.key;
            }
            children.push(child);
          }
        });

        if (children.length > 0) {
          data.push({ ...o, children });
        }
      } else {
        if (!o.accesses) {
          data.push(o);
        } else if (_.intersection(o.accesses, accesses).length > 0) {
          data.push(o);
        }
      }
    });

    return data;
  };

  return (
    <Sider
      width={280}
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="content-slider"
      collapsible
    >
      {!collapsed && <div className="logo" onClick={() => navigate("/")} />}
      <Menu
        theme="dark"
        selectedKeys={"/" + path}
        defaultOpenKeys={openKeys}
        items={getItems()}
        mode="inline"
        onClick={onClick}
      />
    </Sider>
  );
};

Comp.items = items;

export default Comp;
