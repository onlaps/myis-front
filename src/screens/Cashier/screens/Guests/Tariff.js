import { Card, Select, Typography } from "antd";
import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_APP } from "@/actions/app";
import { call } from "@/actions/axios";
import dayjs from "dayjs";

const { Title } = Typography;

const Tariff = (props) => {
  const { tariff, setTariff, loading } = props;

  const dispatch = useDispatch();

  const tariffs = useSelector((state) => state.app.tariffs || []);

  useEffect(() => {
    const getData = async () => {
      const { data } = await dispatch(call({ url: `tariffs` }));

      dispatch(SET_APP(["tariffs"], data));
    };
    getData();
  }, []); //eslint-disable-line

  const items = () => {
    const dow = dayjs().day();
    const day = dow === 0 ? 6 : dow;

    return _.filter(tariffs, (o) => {
      return o.days_of_week.indexOf(day) !== -1;
    });
  };

  return (
    <Card title={`Тариф`} style={{ marginBottom: 16 }}>
      <Title level={5}>Выберите тариф</Title>
      <Select
        style={{ width: "100%" }}
        value={tariff._id}
        onChange={(_id) => setTariff(_.find(tariffs, { _id }))}
        disabled={loading}
      >
        {items().map((v) => (
          <Select.Option key={v._id} value={v._id}>
            {v.name}
          </Select.Option>
        ))}
      </Select>
    </Card>
  );
};

export default Tariff;
