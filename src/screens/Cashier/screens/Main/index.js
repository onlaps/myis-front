import React, { useEffect, useState } from "react";
import { Button, Card, Layout, notification } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
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
  const current_place = useSelector((state) => state.app.current_place);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!current_shift && item.path !== "/") {
      if (isShift(item)) {
        return setShiftOpen(true);
      }
      return notification.warning({
        message: "Смена не открыта",
        description: "Для продолжения необходимо открыть смену",
      });
    }

    if (item.path === "/") {
      dispatch(SET_APP(["current_place"], null));
    } else if (item.path === "/cashier/new") {
      setNewGuest(true);
      return;
    }
    navigate(item.path);
  };

  const getPageTitle = () => {
    if (current_place) {
      return current_place.name;
    }
  };

  const getPageSubtitle = () => {
    return user.name;
  };

  const getTitle = (item) => {
    if (current_shift && isShift(item)) return "Смена";
    return item.title;
  };

  return (
    <Layout>
      <PageHeader
        title={getPageTitle()}
        subTitle={getPageSubtitle()}
        ghost={false}
        extra={[
          <Button type="link" key="exit" onClick={onLogout}>
            Выйти из системы
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
