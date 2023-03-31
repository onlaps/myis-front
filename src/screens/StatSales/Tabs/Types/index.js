import React, { useRef, useState } from "react";
import { useImperativeHandle, forwardRef } from "react";
import { Table, Form, Select, Button } from "antd";
import { Card, DatePicker, Radio, Row, Col } from "antd";
import _ from "lodash";
import Filters from "@/components/Filters";
import ReactApexChart from "react-apexcharts";
import { TableOutlined, AreaChartOutlined } from "@ant-design/icons";
import { columns } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import moment from "moment/moment";
import { Excel } from "antd-table-saveas-excel";

const Comp = forwardRef((props, ref) => {
  const { mode } = props;
  const [type, setType] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);

  const dateRenderer = (v) => {
    const d = moment(v, mode.format);

    if (d.isValid()) {
      return d.format(mode.date);
    }
    return null;
  };

  const options = {
    date: {
      render: dateRenderer,
    },
  };

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
      values.mode = mode;

      const { data } = await dispatch(
        call({ url: `statistic/sales/types`, method: "POST", data: values })
      );

      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(GET_PLACES());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = () => {
    getData();
  };

  useEffect(() => {
    getData();
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const column = (dataIndex) => _.find(columns(options), { dataIndex });

  const getChart = () => {
    const series = [];

    const addColumn = (dataIndex) => {
      const item = column(dataIndex);
      return {
        name: item.title,
        data: data.map((v) => v[dataIndex]),
      };
    };

    series.push(addColumn("card"));
    series.push(addColumn("cash"));

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
        <Col span={12}>
          <div style={{ float: "right" }}>
            <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
              <Radio.Button value="table">
                <TableOutlined />
              </Radio.Button>
              <Radio.Button value="chart">
                <AreaChartOutlined />
              </Radio.Button>
            </Radio.Group>
          </div>
        </Col>
      </Row>
      {type === "table" && (
        <Table
          columns={getColumns}
          pagination={false}
          rowKey="date"
          dataSource={data}
          loading={loading}
        />
      )}
      {type === "chart" && getChart()}
    </>
  );
});

export default Comp;
