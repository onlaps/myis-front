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
      status="403"
      title="403"
      subTitle="Данная страница недоступна. Обратитесь к администратору"
      extra={
        <Button type="primary" onClick={onHome}>
          Вернуться
        </Button>
      }
    />
  );
};

export default Screen;
