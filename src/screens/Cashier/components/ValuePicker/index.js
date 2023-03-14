import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Col, Input, Row } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import classNames from "classnames";

const { Search } = Input;

const buttons = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null],
];

const ValuePicker = (props) => {
  const { onChange, loading } = props;
  const [value, setValue] = useState("0");

  const input = useRef();

  const rows = () => {
    return buttons.map((row, index) => <Row key={index}>{numbers(row)}</Row>);
  };

  const numbers = (row) => {
    return row.map((number, index) => (
      <Col
        key={index}
        span={8}
        className={classNames({
          number_wrapper: true,
          number_loading: loading,
        })}
      >
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

  const onChangeInput = (e) => {
    if (e.target.value === "") e.target.value = "0";
    e.target.value = parseInt(e.target.value).toString();
    setValue(e.target.value);
  };

  useEffect(() => {
    onChange(value);
  }, [value]); // eslint-disable-line

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <div className="sum_picker">
      <Row gutter={40}>
        <Col span={12} offset={6}>
          <Search
            value={value}
            enterButton={<LeftOutlined />}
            onSearch={onSearch}
            ref={input}
            disabled={loading}
            onBlur={() => !loading && input.current.focus()}
            onChange={onChangeInput}
          />
          <div className="keyboard">{rows()}</div>
        </Col>
      </Row>
    </div>
  );
};

export default ValuePicker;
