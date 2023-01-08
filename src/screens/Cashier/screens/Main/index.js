import React, { useEffect, useState } from "react";
import { Button, Card, Layout, PageHeader } from "antd";
import { Row, Col, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { SET_APP, LOGOUT } from "@/actions/app";
import queryString from "query-string";
import data from "./data";
import { call } from "@/actions/axios";
import ShiftOpen from "./ShiftOpen";
import "./index.less";
import NewGuest from "../NewGuest";

const { Content } = Layout;
const { confirm } = Modal;

const Screen = () => {
  const [shiftOpen, setShiftOpen] = useState(false);
  const [newGuest, setNewGuest] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.app.user);
  const current_shift = useSelector((state) => state.app.current_shift);

  const onLogout = () => {
    confirm({
      title: "Выход из системы",
      content: "Вы уверены, что хотите выйти из системы?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        LOGOUT();
        navigate("/login");
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const values = { shift: current_shift._id };

      const query = queryString.stringify(values);

      const { data } = await dispatch(call({ url: `guests?${query}` }));
      dispatch(SET_APP(["guests"], data));
    } catch (e) {}
  };

  const isShift = (item) => item.path.indexOf("shift") !== -1;

  const onClick = (item) => () => {
    if (!current_shift && isShift(item)) {
      return setShiftOpen(true);
    }

    if (item.path === "/") {
      dispatch(SET_APP(["current_place"], null));
    } else if (item.path === "/cashier/new") {
      setNewGuest(true);
      return;
    }
    navigate(item.path);
  };

  const getTitle = (item) => {
    if (current_shift && isShift(item)) return "Смена";
    return item.title;
  };

  return (
    <Layout>
      <PageHeader
        title={user.name}
        ghost={false}
        extra={[
          <Button type="link" key="exit" onClick={onLogout}>
            Выйти
          </Button>,
        ]}
      />
      <ShiftOpen shiftOpen={shiftOpen} setShiftOpen={setShiftOpen} />
      <NewGuest newGuest={newGuest} setNewGuest={setNewGuest} />
      <Content className="main__content__layout">
        <Row gutter={20}>
          {data.map((item, index) => (
            <Col span={4} key={index}>
              <Card
                className="cashier_menu_item"
                hoverable
                onClick={onClick(item)}
              >
                <div>{item.icon}</div>
                <div className="title">{getTitle(item)}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default Screen;
