import React, { useRef, useState } from "react";
import { Form, Select, Button } from "antd";
import { Card, DatePicker, Row, Col } from "antd";
import Filters from "@/components/Filters";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";

const Comp = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();

      values.date = dayjs(values.date).format("YYYY-MM-DD");

      const { data } = await dispatch(
        call({ url: `statistic/visits`, method: "POST", data: values })
      );

      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(GET_PLACES());
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = () => {
    getData();
  };

  const getVisitsChart = (label, items) => {
    const series = [];

    const addColumn = (name, key) => ({
      name,
      data: data.map((v) => v[key]),
    });

    items.forEach((v) => {
      series.push(addColumn(v[0], v[1]));
    });

    const options = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: data.map((v) => v["interval"]),
      },
      dataLabels: {
        enabled: false,
      },
    };

    return (
      <Card title={label} loading={loading}>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </Card>
    );
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Filters ref={form} onFinish={onFinish}>
            <Form.Item name="places">
              <Select
                style={{ width: 300 }}
                placeholder="Все торговые точки"
                loading={loading}
                mode="multiple"
                maxTagCount="responsive"
                allowClear
              >
                {places &&
                  places.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="date">
              <DatePicker
                format="DD.MM.YYYY"
                loading={loading}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Поиск
              </Button>
            </Form.Item>
          </Filters>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          {getVisitsChart(`Количество гостей - ${_.sumBy(data, "visits")}`, [
            ["Гостей", "unclosedVisits"],
            ["Посещений", "totalGuests"],
          ])}
        </Col>
        <Col span={12}>
          {getVisitsChart(`Выручка - ${_.sumBy(data, "sum")}`, [
            ["Выручка", "totalSum"],
          ])}
        </Col>
      </Row>
    </>
  );
};

export default Comp;
