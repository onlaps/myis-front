import React, { useEffect, useState } from "react";
import { Layout, PageHeader, Card, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SET_APP } from "@/actions/app";
import "./index.less";
import { useNavigate } from "react-router";
import { Loading } from "@/ui";
import { call } from "@/actions/axios";

const { Content } = Layout;

const Screen = () => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.app.user);
  const current_place = useSelector((state) => state.app.current_place);

  const onClick = (place) => async () => {
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
    getData();
  }, []); // eslint-disable-line

  if (!ready) return <Loading />;

  return (
    <Layout>
      <PageHeader
        title="Экран кассира"
        subTitle="Выберите торговую точку"
        ghost={false}
      />
      {loading && <Loading />}
      <Content className="main__content__layout">
        {user.places &&
          user.places.map((place) => (
            <Card
              onClick={onClick(place)}
              hoverable={true}
              key={place._id}
              className="place_item"
            >
              {place.name}
            </Card>
          ))}
      </Content>
    </Layout>
  );
};

export default Screen;
