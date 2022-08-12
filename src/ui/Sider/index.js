import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { HomeOutlined, DesktopOutlined } from "@ant-design/icons";
import { ContactsOutlined, ExportOutlined } from "@ant-design/icons";
import { TeamOutlined, DollarOutlined } from "@ant-design/icons";
import { FileMarkdownOutlined, SettingOutlined } from "@ant-design/icons";
import { ContainerOutlined, BarChartOutlined } from "@ant-design/icons";
import { SET_APP } from "@/actions/app";
import "./index.less";

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
  getItem("Экран кассира", "/cashier", <DesktopOutlined />),
  getItem("Гости и акции", "/guests", <ContactsOutlined />, [
    getItem("Карта гостя", "/guests-card"),
    getItem("Бронирование", "/guests-reserve"),
    getItem("Скидки", "/guests-discounts"),
  ]),
  getItem("Сотрудники", "/team", <TeamOutlined />, [
    getItem("График работы", "/team-time"),
    getItem("Ставки по зарплате", "/team-salary"),
    getItem("Расчет зарплаты", "/team-payroll"),
  ]),
  getItem("Финансы", "/finance", <DollarOutlined />, [
    getItem("История смен", "/finance-shift"),
    getItem("История продаж", "/finance-sales"),
    getItem("Расходы", "/finance-costs"),
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
    getItem("Акции", "/stat-promo"),
    getItem("Расходы по категориям", "/stat-costs"),
    getItem("Расходы по месяцам", "/stat-month"),
    getItem("Расходы по дням", "/stat-day"),
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
  const [collapsed, setCollapsed] = useState(false);

  const path = pathname.split("/")[1];

  const onClick = ({ key }) => {
    if (key === "/logout") {
      dispatch(SET_APP(["user"], null));
      navigate("/");
    } else {
      navigate(key);
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

  return (
    <Sider
      width={280}
      collapsed={collapsed}
      onCollapse={(v) => setCollapsed(v)}
      collapsible
    >
      <div className="logo" onClick={() => navigate("/")} />
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
