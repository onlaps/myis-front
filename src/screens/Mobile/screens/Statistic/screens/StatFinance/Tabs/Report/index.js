import React, { useImperativeHandle, useRef, useState } from "react";
import { Table, Form, Select, Button, DatePicker } from "antd";
import Filters from "@/components/Filters";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import { forwardRef } from "react";
import { Excel } from "antd-table-saveas-excel";

const first_column = {
  dataIndex: "name",
  title: "Отчет за период",
};

const Comp = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const dispatch = useDispatch();

  const [columns, setColumns] = useState([first_column]);

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);

  const aggr = () => {
    let arr = [];
    const income = { _id: "1", name: "Доходы (выручка)", type: "bold" };
    const item = { _id: "2", name: "Доходы с товаров и услуг" };
    const guest = { _id: "3", name: "Доходы за часы" };

    if (data?.shifts) {
      data?.shifts.forEach((v) => {
        income[v.month] = v.total;
        item[v.month] = v.items;
        guest[v.month] = v.guests;
      });
    }

    arr.push(income);
    arr.push(item);
    arr.push(guest);

    const expense_1 = { _id: "4", name: "Расходы постоянные", type: "bold" };
    const expenses_1 = [];
    const expense_2 = { _id: "5", name: "Расходы переменные", type: "bold" };
    const expenses_2 = [];

    if (data?.expenses) {
      data?.expenses.forEach(({ values, ...c }) => {
        const item = { ...c };
        if (!item.reported) return;
        values.forEach((v, i) => {
          item[v.month] = v.total;
          if (!expense_1[v.month]) {
            expense_1[v.month] = 0;
          }
          if (!expense_2[v.month]) {
            expense_2[v.month] = 0;
          }
          if (c.type) {
            expense_1[v.month] += v.total;
          } else {
            expense_2[v.month] += v.total;
          }
        });
        if (c.type) {
          expenses_1.push(item);
        } else {
          expenses_2.push(item);
        }
      });
    }

    arr.push(expense_1);
    arr = [...arr, ...expenses_1];

    arr.push(expense_2);
    arr = [...arr, ...expenses_2];

    const action = { _id: "6", name: "Расходы на товар", type: "bold" };
    const actions = [];

    if (data?.wh_actions) {
      data?.wh_actions.forEach(({ values, ...c }) => {
        const item = { ...c };
        values.forEach((v, i) => {
          item[v.month] = v.total;
          if (!action[v.month]) {
            action[v.month] = 0;
          }
          action[v.month] += v.total;
        });
        actions.push(item);
      });
    }

    arr.push(action);
    arr = [...arr, ...actions];

    return arr;
  };

  const _data = aggr();

  useImperativeHandle(
    ref,
    () => ({
      export: () => {
        const excel = new Excel();
        excel
          .addSheet("Выгрузка")
          .addColumns(columns)
          .addDataSource(_data, {
            str2Percent: true,
          })
          .saveAs("Excel.xlsx");
      },
    }),
    [_data, columns]
  );

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      const [start_at, end_at] = values.period;

      values.start_at = dayjs(start_at).format("YYYY-MM-DD");
      values.end_at = dayjs(end_at).format("YYYY-MM-DD");
      const columns = [];

      var startDate = dayjs(start_at);
      var endDate = dayjs(end_at);

      while (endDate.diff(startDate) >= 0) {
        columns.push({
          key: startDate.format("YYYY-MM"),
          dataIndex: startDate.format("YYYY-MM"),
          title: startDate.format("MMM YYYY"),
        });
        startDate = startDate.add(1, "month");
      }

      setColumns([first_column, ...columns]);

      const { data } = await dispatch(
        call({ url: `statistic/finance`, method: "POST", data: values })
      );

      setData(data);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
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

  const getColumns = () => {
    return columns.map((v) => ({
      ...v,
      render: (v, item) => {
        if (item.type === "bold") return <b>{v}</b>;
        return v;
      },
    }));
  };

  return (
    <>
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Поиск
          </Button>
        </Form.Item>
      </Filters>
      <Table
        columns={getColumns()}
        pagination={false}
        size="small"
        rowKey="_id"
        dataSource={_data}
        loading={loading}
      />
    </>
  );
});

export default Comp;
