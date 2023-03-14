import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Layout, Card, notification, Empty } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { useDispatch, useSelector } from "react-redux";
import { LockOutlined } from "@ant-design/icons";
import { SET_APP } from "@/actions/app";
import "./index.less";
import { useNavigate } from "react-router";
import { Loading } from "@/ui";
import { call } from "@/actions/axios";
import classNames from "classnames";

const { Content } = Layout;

const Screen = () => {
  const [ready, setReady] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.app.user);
  const current_place = useSelector((state) => state.app.current_place);

  const onClick = (place) => async () => {
    if (shiftExists(place)) {
      return notification.warning({
        title: "Недоступно",
        message: "На выбранной торговой точке уже открыта смена!",
      });
    }
    try {
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `shifts/${place._id}?closed=false` })
      );
      setLoading(false);
      if (data && data.user._id === user._id) {
        return notification.warning({
          title: "Недоступно",
          message: "На выбранной торговой точке уже открыта смена!",
        });
      }
      dispatch(SET_APP(["current_place"], place));
      navigate("/cashier/main");
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (current_place) return navigate("/cashier/main");
    const getData = async () => {
      try {
        const { data } = await dispatch(call({ url: `shifts` }));
        setReady(true);
        if (data) {
          dispatch(SET_APP(["current_shift"], data));
          dispatch(SET_APP(["current_place"], data.place));
          navigate("/cashier/main");
        }
      } catch (e) {
        notification.error({
          title: "Ошибка",
          message: "Не удалось получить данные",
        });
        setReady(true);
      }
    };
    const getUserPlaces = async () => {
      try {
        setLoading(true);
        const { data } = await dispatch(call({ url: `users/places` }));

        setLoading(false);
        if (data) {
          dispatch(SET_APP(["user"], { ...user, ...data }));
        }
      } catch (e) {
        setLoading(false);
      }
    };
    const getOpenedShifts = async () => {
      try {
        setLoading(true);
        const { data } = await dispatch(call({ url: `shifts/opened/all` }));

        setLoading(false);
        setShifts(data);
      } catch (e) {
        setLoading(false);
      }
    };
    getUserPlaces();
    getOpenedShifts();
    getData();
  }, []); // eslint-disable-line

  if (!ready) return <Loading />;

  const data = () => {
    if (!user.places) return [];
    return _.filter(user.places, { status: true });
  };

  const shiftExists = (place) => {
    return !!_.find(shifts, (o) => o?.place?._id === place._id);
  };

  const getName = (place) => {
    if (shiftExists(place)) {
      return (
        <>
          <LockOutlined />
          {place.name}
        </>
      );
    }
    return place.name;
  };

  return (
    <Layout>
      <PageHeader
        title="Экран кассира"
        subTitle="Выберите торговую точку"
        ghost={false}
      />
      {loading && <Loading />}
      <Content className="main__content__layout">
        {data().length > 0 ? (
          data().map((place) => {
            const className = classNames({
              place_item: true,
              place_item_blocked: shiftExists(place),
            });
            return (
              <Card
                onClick={onClick(place)}
                hoverable={true}
                key={place._id}
                className={className}
              >
                {getName(place)}
              </Card>
            );
          })
        ) : (
          <Card>
            <Empty description="Нет привязанных торговых точек" />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default Screen;
