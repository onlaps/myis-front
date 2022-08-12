import React, { useContext, useRef, useState } from "react";
import { Form, Input, Modal, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Context } from ".";
import { normFile } from "@/utils";

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding } = context;
  const [loading, setLoading] = useState(false);
  const form = useRef();

  return (
    <Modal
      title="Создать"
      visible={adding}
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
          label="Торговые точки"
          name="place"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select mode="multiple">
            <Select.Option value="test">test</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger multiple={false} name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Нажмите или перетащите файл для загрузки
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Comp;
