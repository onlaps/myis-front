import React, { useContext, useRef, useState } from "react";
import { Form, Input, Modal, Select, Row, Col, Divider } from "antd";
import { Typography, Switch, Upload } from "antd";
import { Context } from ".";
import { InboxOutlined } from "@ant-design/icons";
import { normFile } from "@/utils";

const { Title } = Typography;

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
      width="70%"
      onCancel={() => setAdding(false)}
    >
      <Form layout="vertical" ref={form}>
        <Row gutter={40}>
          <Col span={12} style={{ borderRight: "1px solid #ededed" }}>
            <Form.Item
              label="Группа"
              name="group"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Select>
                <Select.Option value="test">test</Select.Option>
              </Select>
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
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Название в чеке"
                  name="name"
                  rules={[
                    { required: true, message: "Данное поле обязательно" },
                  ]}
                >
                  <Input disabled={loading} placeholder="Введите текст" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="status" label="Доступно для заказов">
                  <Switch disabled={loading} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Цена продажи"
                  name="price"
                  rules={[
                    { required: true, message: "Данное поле обязательно" },
                  ]}
                >
                  <Input disabled={loading} placeholder="Введите текст" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="custom_price" label="Произвольная цена">
                  <Switch disabled={loading} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Комментарий" name="description">
              <Input.TextArea disabled={loading} placeholder="Введите текст" />
            </Form.Item>
            <Form.Item>
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger
                  multiple={false}
                  name="files"
                  action="/upload.do"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Нажмите или перетащите файл для загрузки
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Title level={5}>Цена на торговых точках</Title>
            {[1].map((value) => (
              <div key={value}>
                <Title level={5}>MYROOM BIO</Title>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item label="Комментарий" name="place_status">
                      <Switch disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label="Цена" name="place_price">
                      <Input disabled={loading} placeholder="Введите цену" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label="Скидка" name="discount">
                      <Select>
                        <Select.Option value="test">test</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
              </div>
            ))}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Comp;
