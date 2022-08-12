import React, { useContext, useRef, useState } from "react";
import { Table, Modal, Form, Input, Select } from "antd";
import { columns } from "./data";
import { Context } from "../../index";

const Comp = () => {
  const form = useRef();

  const context = useContext(Context);
  const { adding, setAdding, activeKey } = context;
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (pagination, filters, sorter) => {
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };
  const options = {
    actions: {
      render: (_, item) => {
        return <div className="actions">123</div>;
      },
    },
  };
  return (
    <>
      <Modal
        title="Создать"
        visible={adding && activeKey === "2"}
        okText="Сохранить"
        onCancel={() => setAdding(false)}
      >
        <Form layout="vertical" ref={form}>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Данное поле обязательно" }]}
          >
            <Input disabled={loading} placeholder="Введите текст" />
          </Form.Item>
          <Form.Item
            label="Тип"
            name="type"
            rules={[{ required: true, message: "Данное поле обязательно" }]}
          >
            <Select>
              <Select.Option value="test">test</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Значение"
            name="value"
            rules={[{ required: true, message: "Данное поле обязательно" }]}
          >
            <Input
              disabled={loading}
              placeholder="Например, 250"
              addonAfter="гр"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns(options, filters, sorter)} onChange={onChange} />
    </>
  );
};

export default Comp;
