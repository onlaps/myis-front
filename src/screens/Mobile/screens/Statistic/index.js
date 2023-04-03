import { useState } from "react";
import { Tabs, Card } from "antd";
import { StatABC, StatDiscounts, StatFinance } from "./screens";
import { StatVisits, StatSales, StatExpenses } from "./screens";

const items = [
  { key: 0, label: "Финансы" },
  { key: 1, label: "Продажи" },
  { key: 2, label: "ABC – Анализ" },
  { key: 3, label: "Скидки" },
  { key: 4, label: "Расходы" },
  { key: 5, label: "Посещаемость" },
];

const Screen = () => {
  const [active, setActive] = useState(0);
  return (
    <>
      <Tabs items={items} onChange={(v) => setActive(v)} activeKey={active} />
      {active === 0 && <StatExpenses />}
      {active === 1 && <StatSales />}
      {active === 2 && <StatABC />}
      {active === 3 && <StatDiscounts />}
      {active === 4 && <StatFinance />}
      {active === 5 && <StatVisits />}
    </>
  );
};

export default Screen;
