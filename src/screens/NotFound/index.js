import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router";

const Screen = (props) => {
  const navigate = useNavigate();

  const onHome = () => {
    navigate("/");
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="Данная страница не существует"
      extra={
        <Button type="primary" onClick={onHome}>
          Обновить
        </Button>
      }
    />
  );
};

export default Screen;
