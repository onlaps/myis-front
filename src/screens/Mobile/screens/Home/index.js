import React from "react";
import { Row, Col, Card, Statistic, notification } from "antd";
import { Tabs, List } from "antd";
import { columns } from "./data";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { call } from "@/actions/axios";
import { useState } from "react";
import _ from "lodash";

const Screen = (props) => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await dispatch(
          call({ url: `places/statistic/total` })
        );
        setData(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        notification.error({
          title: "Ошибка",
          message: "Не удалось получить данные",
        });
      }
    };
    getData();
  }, []); // eslint-disable-line

  const agg = (v) => _.sumBy(data, v);

  const getValue = (v) => {
    if (v === 0) {
      const guests = agg("offline_guests");
      if (guests === 0) return 0;
      return agg("online_guests") / guests;
    } else if (v === 1) return agg("revenue_today");
    else if (v === 2) return _.meanBy(data, "total_guests_month");
    else if (v === 3) return agg("revenue_month");
    else if (v === 4) return agg("expenses_month");
    else if (v === 5) return agg("profit_month");
  };

  const mainTabs = [
    { key: 0, label: "Клиентов, сегодня" },
    { key: 1, label: "Выручка, сегодня" },
    { key: 2, label: "Клиентов, в среднем" },
    {
      key: 3,
      label: "Выручка, с начала месяца",
    },
    {
      key: 4,
      label: "Расходы, с начала месяца",
    },
    {
      key: 5,
      label: "Прибыль, с начала месяца",
    },
  ];

  const getPlaceValue = ({ dataIndex }) => {
    if (data.length === 0) return 0;
    const item = data[active];
    if (dataIndex === "guests") {
      return item?.online_guests + item?.offline_guests;
    }

    return Math.round(item[dataIndex]);
  };

  return (
    <>
      <Card>
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={mainTabs}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={item.label}
                description={getValue(index)}
              />
            </List.Item>
          )}
        />
      </Card>

      <Tabs
        items={data.map((v, index) => ({ label: v.name, key: index }))}
        onChange={(v) => setActive(v)}
        activeKey={active}
      />

      <Card>
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={columns(null)}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={getPlaceValue(item)}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Screen;
