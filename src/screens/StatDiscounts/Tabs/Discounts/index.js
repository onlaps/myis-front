import React, { useRef, useState } from "react";
import { useImperativeHandle, forwardRef } from "react";
import { Table, Form, Select, Button } from "antd";
import { DatePicker, Row, Col } from "antd";
import Filters from "@/components/Filters";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Excel } from "antd-table-saveas-excel";

const Comp = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);

  const options = {};

  const getColumns = columns(options);

  useImperativeHandle(
    ref,
    () => ({
      export: () => {
        const excel = new Excel();
        excel
          .addSheet("Выгрузка")
          .addColumns(getColumns)
          .addDataSource(data, {
            str2Percent: true,
          })
          .saveAs("Excel.xlsx");
      },
    }),
    [data, getColumns]
  );

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();

      const [start_at, end_at] = values.period;
      values.start_at = dayjs(start_at).format("YYYY-MM-DD");
      values.end_at = dayjs(end_at).format("YYYY-MM-DD");

      const { data } = await dispatch(
        call({ url: `statistic/discounts`, method: "POST", data: values })
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

  return (
    <>
      <Row>
        <Col span={12}>
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
        </Col>
      </Row>
      <Table
        columns={columns(options)}
        pagination={false}
        rowKey="_id"
        dataSource={data}
        loading={loading}
      />
    </>
  );
});

export default Comp;
