import React, { useEffect, useState } from "react";
import _ from "lodash";
import classNames from "classnames";
import { Col, Input, Row, List } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./index.less";

const buttons = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null],
];

const notes = [
  20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1,
];

const { Search } = Input;

const SumPicker = (props) => {
  const { onChange, children } = props;
  const [selectedNote, setSelectedNote] = useState();
  const list = notes.map((note) => ({ note, value: "0" }));
  const [notesList, setNotesList] = useState(list);

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
    if (!selectedNote) return;
    const list = [...notesList];
    const noteIndex = _.findIndex(notesList, { note: selectedNote });
    if (list[noteIndex].value.toString() === "0") list[noteIndex].value = "";
    list[noteIndex].value = list[noteIndex].value + number.toString();
    setNotesList(list);
  };

  const onSearch = () => {
    const list = [...notesList];
    const noteIndex = _.findIndex(notesList, { note: selectedNote });
    list[noteIndex].value = list[noteIndex].value.slice(0, -1);
    if (!list[noteIndex].value) list[noteIndex].value = "0";
    setNotesList(list);
  };

  const getTitle = () => {
    if (!selectedNote) return "Выберите купюру из списка в левом столбце";
    return `Задайте количество купюр и монет по ${selectedNote} ₸`;
  };

  const sum = _.sumBy(notesList, (o) => {
    return o.note * o.value;
  });

  useEffect(() => {
    onChange(sum);
  }, [sum]); // eslint-disable-line

  return (
    <div className="sum_picker">
      <Row gutter={40}>
        <Col span={12}>
          <List
            dataSource={notesList}
            rowKey={(o) => o.toString()}
            renderItem={(item) => (
              <List.Item
                className={classNames({
                  selectedNote: selectedNote === item.note,
                })}
                onClick={() => setSelectedNote(item.note)}
              >
                <List.Item.Meta title={`${item.note} ₸`} />
                <div className="note_amount">x {item.value}</div>
              </List.Item>
            )}
          />
          <List.Item className="total">
            <List.Item.Meta title="Итого" />
            <div className="note_total">{`${sum} ₸`}</div>
          </List.Item>
          {children && children}
        </Col>
        <Col span={12}>
          <div className="title">{getTitle()}</div>
          <Search
            disabled={!selectedNote}
            value={
              selectedNote && _.find(notesList, { note: selectedNote }).value
            }
            placeholder="Количество"
            enterButton={<LeftOutlined />}
            onSearch={onSearch}
          />
          <div className="keyboard">{rows()}</div>
        </Col>
      </Row>
    </div>
  );
};

export default SumPicker;
