import { Button, Layout } from "antd";
import { useState } from "react";
import { Home, Statistic } from "./screens";
import "./index.less";

const { Header, Content } = Layout;

const items = [
  { key: 0, name: "Главная" },
  { key: 1, name: "Статистика" },
];

const Screen = () => {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          background: "white",
          textAlign: "center",
        }}
      >
        {items.map((v) => (
          <Button
            key={v.key}
            onClick={() => setActive(v.key)}
            type={active === v.key && "primary"}
          >
            {v.name}
          </Button>
        ))}
      </Header> */}
      <Content className="mobile__content">
        {active === 0 && <Home />}
        {/* {active === 1 && <Statistic />} */}
      </Content>
    </>
  );
};

export default Screen;
