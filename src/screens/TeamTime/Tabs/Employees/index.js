import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, DatePicker, Form, Popover, Select, Table } from "antd";
import { columns } from "./data";
import moment from "moment";
import _ from "lodash";
import { Context } from "../..";
import { useSelector } from "react-redux";
import Filters from "@/components/Filters";

const Comp = () => {
  const context = useContext(Context);
  const { loading, setEditing, setAdding, setDataFilters, dataFilters } =
    context;
  const [days, setDays] = useState({});
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);

  const form = useRef();

  const places = useSelector((state) => state.app.places || []);
  const schedules = useSelector((state) => state.app.schedules || []);
  const date = useSelector((state) => state.app.date);

  const items = _.groupBy(schedules, (o) => o.user.name);

  useEffect(() => {
    if (!_.isEmpty(dataFilters)) {
      form.current.setFieldsValue(dataFilters);
    }
  }, [dataFilters]);

  useEffect(() => {
    const start = moment(date).startOf("week");
    const end = moment(date).endOf("week");
    let days = end.diff(start, "days");
    let dates = [];
    for (let i = 0; i <= days; i++) {
      const day = moment(start).add(i, "days");
      const date = day.format("YYYY-MM-DD");
      dates.push({
        title: day.format("DD.MM dd").toUpperCase(),
        date,
        onCell: (item) => {
          const data = items[item.user];
          const _data = _.filter(data, (o) => o.date === date);
          const isContent = _data.length > 0;
          if (isContent) return { style: { backgroundColor: "#04C100" } };
          return { style: { backgroundColor: "#EFC100" } };
        },
        render: (val, item) => {
          const data = items[item.user];
          const _data = _.filter(data, (o) => o.date === date);
          const isContent = _data.length > 0;
          if (isContent) {
            const content = _data.map((v) => (
              <div key={v._id}>
                <Button
                  onClick={() => {
                    setAdding(true);
                    setEditing(v);
                  }}
                  type="link"
                >
                  <div
                    style={{ width: 100, float: "left", textAlign: "right" }}
                  >
                    #{v.shift_number}
                  </div>
                  <div style={{ width: 100, float: "left" }}>
                    {v.time_from} - {v.time_to}
                  </div>
                </Button>
              </div>
            ));
            return (
              <Popover placement="bottom" content={content} trigger="hover">
                Смен: {_data.length}
              </Popover>
            );
          }
          return null;
        },
      });
    }
    setDays(dates);
  }, []);

  const getDays = () => {
    const $days = {};
    if (_.isEmpty(days)) return {};
    days.forEach((d, i) => ($days[i] = d));
    return $days;
  };

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const options = {
    user: {
      render: (val) => {
        return <div>{val}</div>;
      },
    },
    ...getDays(),
  };

  const onFinish = async () => {
    const values = await form.current.validateFields();
    if (values.date) {
      values.start_at = moment(values.date)
        .startOf("week")
        .format("YYYY-MM-DD");
      values.end_at = moment(values.date).endOf("week").format("YYYY-MM-DD");
    }
    setDataFilters(values);
  };

  return (
    <>
      <Filters ref={form} onFinish={onFinish}>
        <Form.Item name="place">
          <Select
            allowClear
            style={{ width: 150 }}
            placeholder="Все торговые точки"
          >
            {places.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date">
          <DatePicker picker="week" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        columns={columns(options, filters, sorter)}
        pagination={pagination}
        onChange={onChange}
        loading={loading}
        dataSource={Object.keys(items).map((key) => ({
          key,
          user: key,
          data: items[key],
        }))}
      />
    </>
  );
};

export default Comp;
