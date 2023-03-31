import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, Table, Select, DatePicker, Button } from "antd";
import { Popover } from "antd";
import { columns } from "./data";
import dayjs from "dayjs";
import { SET_APP } from "@/actions/app";
import _ from "lodash";
import { Context } from "../..";
import { useDispatch, useSelector } from "react-redux";
import Filters from "@/components/Filters";
import usePrevious from "@/hooks/usePrevious";
import Immutable from "immutable";

const Comp = () => {
  const context = useContext(Context);
  const { loading, setEditing, setAdding, setDataFilters, dataFilters } =
    context;
  const [days, setDays] = useState({});
  // const [filters, setFilters] = useState(null);
  // const [pagination, setPagination] = useState(null);
  // const [sorter, setSorter] = useState(null);

  const form = useRef();

  const places = useSelector((state) => state.app.places || []);
  const schedules = useSelector((state) => state.app.schedules || []);
  const date = useSelector((state) => state.app.date);

  const dispatch = useDispatch();

  const items = _.groupBy(schedules, "shift_number");

  const _items = usePrevious(items);
  const _dataFilters = usePrevious(dataFilters);

  useEffect(() => {
    dispatch(SET_APP(["schedules"], []));
  }, []); //eslint-disable-line

  useEffect(() => {
    if (!_.isEmpty(dataFilters)) {
      form.current.setFieldsValue(dataFilters);
    }
  }, [dataFilters]);

  useEffect(() => {
    if (
      !Immutable.fromJS(items).equals(Immutable.fromJS(_items)) ||
      !Immutable.fromJS(dataFilters).equals(Immutable.fromJS(_dataFilters))
    ) {
      updateDates();
    }
  }, [dataFilters, items]); //eslint-disable-line

  useEffect(() => {
    updateDates();
  }, [dataFilters]); //eslint-disable-line

  const updateDates = () => {
    const start = dayjs(date).startOf("week");
    const end = dayjs(date).endOf("week");
    let days = end.diff(start, "days");
    let $dates = [];
    for (let i = 0; i <= days; i++) {
      const day = dayjs(start).add(i, "days");
      const date = day.format("YYYY-MM-DD");
      $dates.push({
        title: day.format("DD.MM dd").toUpperCase(),
        date,
        onCell: (item) => {
          const data = items[item.key];
          const _data = _.filter(data, (o) => o.date === date);
          const isContent = _data.length > 0;
          if (isContent) return { style: { backgroundColor: "#04C100" } };
          return { style: { backgroundColor: "#EFC100" } };
        },
        render: (val, item) => {
          const data = items[item.shift_number];
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
                    {v.user.name}
                  </div>
                  <div style={{ width: 100, float: "left" }}>
                    {v.time_from} - {v.time_to}
                  </div>
                </Button>
              </div>
            ));
            return (
              <Popover placement="bottom" content={content} trigger="hover">
                Сотрудников: {_data.length}
              </Popover>
            );
          }
          return null;
        },
      });
    }
    setDays($dates);
  };

  const getDays = () => {
    const $days = {};
    if (_.isEmpty(days)) return {};
    days.forEach((d, i) => ($days[i] = d));
    return $days;
  };

  // const onChange = (pagination, filters, sorter) => {
  //   setPagination(pagination);
  //   setFilters(filters);
  //   setSorter({ [sorter.field]: sorter.order });
  // };

  const options = {
    shift_number: {
      render: (val) => {
        return <div>#{val}</div>;
      },
    },
    ...getDays(),
  };

  const onFinish = async () => {
    const values = await form.current.validateFields();
    if (values.date) {
      values.start_at = dayjs(values.date).startOf("week").format("YYYY-MM-DD");
      values.end_at = dayjs(values.date).endOf("week").format("YYYY-MM-DD");
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
        columns={columns(options)}
        pagination={null}
        loading={loading}
        dataSource={Object.keys(items).map((key) => ({
          key,
          shift_number: key,
          data: items[key],
        }))}
      />
    </>
  );
};

export default Comp;
