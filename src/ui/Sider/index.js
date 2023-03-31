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
import { useDispatch, useSelector } from "react-redux";

const { Sider } = Layout;

const getItem = (label, key, icon, children, type) => ({
  key,
  icon,
  children,
  label,
  type,
});

const items = [
  getItem("Главная", "/", <HomeOutlined />),
  getItem("Экран кассира", "/cashier-select", <DesktopOutlined />),
  getItem("Гости и акции", "/guests", <ContactsOutlined />, [
    getItem("Карта гостя", "/guests-cards"),
    getItem("Бронирование", "/guests-booking"),
    getItem("Скидки", "/guests-discounts"),
  ]),
  getItem("Сотрудники", "/team", <TeamOutlined />, [
    getItem("График работы", "/team-time"),
    getItem("Зарплаты и планы", "/team-salary"),
    getItem("Расчет зарплаты", "/team-payroll"),
    getItem("Чек-листы смен", "/team-checklists"),
  ]),
  getItem("Финансы", "/finance", <DollarOutlined />, [
    getItem("История смен", "/finance-shifts"),
    getItem("История продаж", "/finance-sales"),
    getItem("Расходы", "/finance-expenses"),
    getItem("Тарифы оплаты времени", "/finance-plans"),
  ]),
  getItem("Меню", "/menu", <FileMarkdownOutlined />, [
    getItem("Справочники", "/menu-dict"),
    getItem("Пункты меню", "/menu-items"),
  ]),
  getItem("Склад", "/wh", <ContainerOutlined />, [
    getItem("Справочники", "/wh-dict"),
    getItem("Товары", "/wh-items"),
    getItem("Движение товара", "/wh-actions"),
  ]),
  getItem("Статистика", "/stat", <BarChartOutlined />, [
    getItem("Финансы", "/stat-finance"),
    getItem("Продажи", "/stat-sales"),
    getItem("ABC – Анализ", "/stat-abc"),
    getItem("Скидки", "/stat-disc"),
    getItem("Расходы", "/stat-month"),
    getItem("Посещаемость", "/stat-visits"),
  ]),
  getItem("Настройки", "/edit", <SettingOutlined />, [
    getItem("Сотрудники", "/edit-team"),
    getItem("Роли", "/edit-roles"),
    getItem("Сменить пароль", "/edit-password"),
    getItem("Торговые точки", "/edit-places"),
    getItem("История действий", "/edit-actions"),
  ]),
  getItem("Выход", "/logout", <ExportOutlined />),
];

const Comp = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.app.collapsed || false);

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
        items={items}
        mode="inline"
        onClick={onClick}
      />
    </Sider>
  );
};

export default Comp;
