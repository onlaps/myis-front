import React, { useRef, useState } from "react";
import { Form, Select, Button } from "antd";
import { Card, DatePicker, Row, Col } from "antd";
import Filters from "@/components/Filters";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { SET_APP } from "@/actions/app";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import moment from "moment";
import _ from "lodash";

const Comp = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);
  const expense_categories = useSelector(
    (state) => state.app.expense_categories || []
  );

  const getExpenseCategories = async () => {
    try {
      const { data } = await dispatch(call({ url: `expense_categories` }));
      dispatch(SET_APP(["expense_categories"], data));
    } catch (e) {}
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();

      const [start_at, end_at] = values.period;
      values.start_at = dayjs(start_at).format("YYYY-MM-DD");
      values.end_at = dayjs(end_at).format("YYYY-MM-DD");

      setCategories(values.categories || []);

      const { data } = await dispatch(
        call({ url: `statistic/expenses`, method: "POST", data: values })
      );

      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(GET_PLACES());
    getExpenseCategories();
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = () => {
    getData();
  };

  const dateRenderer = (v) => {
    const d = moment(v, "YYYY-MM");

    if (d.isValid()) {
      return d.format("YYYY-MM");
    }
    return null;
  };

  const getChart = () => {
    const series = [];

    const addColumn = (id, name) => {
      return {
        name,
        data: data.map((v) => v[id]),
      };
    };

    const getCategories = (data) => {
      data.forEach(({ _id, name }) => {
        series.push(addColumn(_id, name));
      });
    };

    if (categories.length > 0) {
      getCategories(
        _.filter(expense_categories, (o) => categories.indexOf(o._id) !== -1)
      );
    } else {
      getCategories(expense_categories);
    }

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
        categories: data.map((v) => dateRenderer(v.date)),
      },
      dataLabels: {
        enabled: false,
      },
    };

    return (
      <Card>
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
            <Form.Item name="period">
              <DatePicker.RangePicker
                format="DD.MM.YYYY"
                loading={loading}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item name="categories">
              <Select
                style={{ width: 300 }}
                placeholder="Все категории"
                loading={loading}
                mode="multiple"
                maxTagCount="responsive"
                allowClear
              >
                {expense_categories &&
                  expense_categories.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Поиск
              </Button>
            </Form.Item>
          </Filters>
        </Col>
      </Row>
      {getChart()}
    </>
  );
};

export default Comp;
