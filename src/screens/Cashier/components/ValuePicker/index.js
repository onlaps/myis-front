import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Col, Input, Row } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const { Search } = Input;

const buttons = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null],
];

const ValuePicker = (props) => {
  const { onChange } = props;
  const [value, setValue] = useState("0");

  const rows = () => {
    return buttons.map((row, index) => <Row key={index}>{numbers(row)}</Row>);
  };

  const numbers = (row) => {
    return row.map((number, index) => (
      <Col key={index} span={8} className="number_wrapper">
        {isButton(number)}
      </Col>
    ));
  };

  const isButton = (number) => {
    if (_.isNumber(number))
      return (
        <div className="number" onClick={onClick(number)}>
          {number}
        </div>
      );
    else return null;
  };

  const onClick = (number) => () => {
    let v = value.toString();
    if (v === "0") v = "";
    v = v + number.toString();
    setValue(v);
  };

  const onSearch = () => {
    let v = value.toString();
    v = v.slice(0, -1);
    if (!v) v = "0";
    setValue(v);
  };

  useEffect(() => {
    onChange(value);
  }, [value]); // eslint-disable-line

  return (
    <div className="sum_picker">
      <Row gutter={40}>
        <Col span={12} offset={6}>
          <Search
            value={value}
            enterButton={<LeftOutlined />}
            onSearch={onSearch}
          />
          <div className="keyboard">{rows()}</div>
        </Col>
      </Row>
    </div>
  );
};

export default ValuePicker;
