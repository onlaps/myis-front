import React, { useRef, useState } from "react";
import { useImperativeHandle, forwardRef } from "react";
import { Table, Form, Select, Button } from "antd";
import { Card, DatePicker, Radio, Row, Col } from "antd";
import Filters from "@/components/Filters";
import ReactApexChart from "react-apexcharts";
import { TableOutlined, AreaChartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GET_PLACES } from "@/actions/api";
import { call } from "@/actions/axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import moment from "moment/moment";
import { Excel } from "antd-table-saveas-excel";
import queryString from "query-string";

const Comp = forwardRef((props, ref) => {
  const { mode } = props;

  const dateRenderer = (v) => {
    const d = moment(v, mode.format);

    if (d.isValid()) {
      return d.format(mode.date);
    }
    return null;
  };

  const first_column = {
    dataIndex: "date",
    title: "Дата",
    render: dateRenderer,
  };

  const [cType, setCType] = useState("sum");
  const [type, setType] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([first_column]);

  const dispatch = useDispatch();

  const form = useRef();
  const places = useSelector((state) => state.app.places || []);

  useImperativeHandle(
    ref,
    () => ({
      export: () => {
        const excel = new Excel();
        excel
          .addSheet("Выгрузка")
          .addColumns(columns)
          .addDataSource(data, {
            str2Percent: true,
          })
          .saveAs("Excel.xlsx");
      },
    }),
    [data, columns]
  );

  const getData = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();

      const [start_at, end_at] = values.period;
      values.start_at = dayjs(start_at).format("YYYY-MM-DD");
      values.end_at = dayjs(end_at).format("YYYY-MM-DD");
      values.mode = mode;

      const columns = [];

      const query = queryString.stringify(values);

      const { data: categories } = await dispatch(
        call({ url: `menu_categories?${query}` })
      );

      categories.forEach((c) => {
        columns.push({
          dataIndex: c._id,
          title: c.name,
          render: (v) => {
            return `${v.total} (${v.count})`;
          },
        });
      });

      setColumns([first_column, ...columns]);

      const { data } = await dispatch(
        call({ url: `statistic/sales/items`, method: "POST", data: values })
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

  const getChart = () => {
    const series = [];

    const addColumn = (id, name) => {
      return {
        name,
        data: data.map((v) => v[id][cType]),
      };
    };

    if (columns.length > 0) {
      columns.forEach(({ dataIndex: id, title }) => {
        if (id === "date") return null;
        series.push(addColumn(id, title));
      });
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
        <Radio.Group
          buttonStyle="solid"
          onChange={(e) => setCType(e.target.value)}
          value={cType}
        >
          <Radio.Button value="total">Сумма</Radio.Button>
          <Radio.Button value="count">Количество</Radio.Button>
        </Radio.Group>
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
          columns={columns}
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
