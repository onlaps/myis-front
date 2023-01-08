import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Modal, Select, Row, Col, InputNumber } from "antd";
import { Typography, Switch, Divider } from "antd";
import { Upload, Menu, Dropdown } from "antd";
import { Context } from ".";
// import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { call } from "@/actions/axios";
import { PUSH_APP, SET_APP_BY_PARAM } from "@/actions/app";
import _ from "lodash";

const { Title } = Typography;

const Comp = (props) => {
  const context = useContext(Context);
  const { adding, setAdding, editing, setEditing } = context;
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);
  const form = useRef();

  const dispatch = useDispatch();

  const menu_categories = useSelector(
    (state) => state.app.menu_categories || []
  );
  const places = useSelector((state) => state.app.places || []);
  const wh_items = useSelector((state) => state.app.wh_items || []);

  useEffect(() => {
    if (form.current) {
      form.current.resetFields();
    }
    if (editing) {
      const values = { ...editing };
      const { image, ...rest } = values;
      if (image) {
        setPath(image);
      }
      if (rest.wh_item) {
        rest.wh_item = rest.wh_item._id;
      }
      form.current.setFieldsValue(rest);
    }
  }, [editing]);

  useEffect(() => {
    if (!adding && form.current) {
      form.current.resetFields();
      setPath(null);
      setEditing(null);
    }
  }, [adding]);

  const onSubmit = async () => {
    const values = await form.current.validateFields();

    if (path) {
      values.image = path;
    }

    if (_.isEmpty(values.menu_category)) values.menu_category = null;
    else values.menu_category = values.menu_category._id;

    try {
      setLoading(true);
      if (editing) {
        const { _id } = editing;
        const { data } = await dispatch(
          call({ url: `menu_items/${_id}`, method: "PATCH", data: values })
        );
        dispatch(SET_APP_BY_PARAM(["menu_items"], ["_id", _id], data));
        setAdding(false);
      } else {
        const { data } = await dispatch(
          call({ url: `menu_items`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["menu_items"], data));
        setAdding(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDelete = () => {
    dispatch(
      call({
        url: `menu_items/upload/image`,
        method: "DELETE",
        data: { path },
      })
    );
  };

  const onCancel = () => {
    try {
      if (!editing) {
        onDelete();
      }
      setAdding(false);
    } catch (e) {}
  };

  // const onClick = (e) => {
  //   if (e.key === "1") {
  //     onDelete();
  //     setPath(null);
  //   }
  // };

  // const customRequest = async (options) => {
  //   const { file } = options;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const headers = {
  //       "Content-type": "multipart/form-data",
  //     };
  //     const { data } = await dispatch(
  //       call({
  //         url: `menu_items/upload`,
  //         method: "POST",
  //         data: formData,
  //         headers,
  //       })
  //     );
  //     const { path } = data;
  //     setPath(path);
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };

  // const menu = (
  //   <Menu
  //     onClick={onClick}
  //     items={[
  //       {
  //         label: "Удалить",
  //         key: "1",
  //       },
  //     ]}
  //   />
  // );

  return (
    <Modal
      title="Создать"
      visible={adding}
      okText="Сохранить"
      width={700}
      onCancel={onCancel}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form
        layout="vertical"
        ref={form}
        initialValues={{
          item_prices: places.map((v) => ({
            place: v._id,
            price: 0,
            type: "2",
            available: false,
          })),
        }}
      >
        <Form.Item
          label="Группа"
          name={["menu_category", "_id"]}
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select placeholder="Выберите группу" disabled={loading}>
            {menu_categories.map((v) => (
              <Select.Option key={v._id} value={v._id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Тип"
          name="type"
          rules={[{ required: true, message: "Данное поле обязательно" }]}
        >
          <Select placeholder="Выберите тип" disabled={loading}>
            <Select.Option value="1">Услуга</Select.Option>
            <Select.Option value="2">Товар</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(pv, cv) => pv.type !== cv.type}>
          {(v) => {
            const type = v.getFieldValue("type");
            if (type === "2") {
              return (
                <Form.Item
                  label="Товар"
                  name="wh_item"
                  rules={[
                    { required: true, message: "Данное поле обязательно" },
                  ]}
                >
                  <Select placeholder="Выберите товар" disabled={loading}>
                    {wh_items.map((v) => (
                      <Select.Option key={v._id} value={v._id}>
                        {v.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            }
          }}
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Название в чеке"
              name="name"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <Input disabled={loading} placeholder="Введите текст" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="available"
              label="Доступно для заказов"
              valuePropName="checked"
            >
              <Switch disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Цена продажи"
              name="price"
              rules={[{ required: true, message: "Данное поле обязательно" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                disabled={loading}
                placeholder="Введите цену"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="custom_price"
              label="Произвольная цена"
              valuePropName="checked"
            >
              <Switch disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Комментарий" name="description">
          <Input.TextArea disabled={loading} placeholder="Введите текст" />
        </Form.Item>
        {/*path ? (
              <Dropdown overlay={menu} trigger={["contextMenu"]}>
                <img
                  src={process.env.REACT_APP_BASE_URL + path}
                  className="image-preview"
                  alt="preview"
                />
              </Dropdown>
            ) : (
              <Upload.Dragger
                className="uploader"
                multiple={false}
                showUploadList={false}
                customRequest={customRequest}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Нажмите или перетащите файл для загрузки
                </p>
              </Upload.Dragger>
            )*/}
        <Divider />
        <Title level={5}>Цена на торговых точках</Title>
        {places.map((v, i) => (
          <div key={v._id}>
            <Title level={5}>{v.name}</Title>

            <Form.Item noStyle name={["item_prices", i, "place"]}>
              <Input type="hidden" />
            </Form.Item>
            <Row gutter={20}>
              <Col span={4}>
                <Form.Item
                  label="Другая цена"
                  name={["item_prices", i, "available"]}
                  valuePropName="checked"
                >
                  <Switch disabled={loading} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  noStyle
                  shouldUpdate={(pv, cv) =>
                    pv.item_prices[i]?.available !==
                      cv.item_prices[i]?.available || pv.price !== cv.price
                  }
                >
                  {(v) => {
                    const items = v.getFieldValue("item_prices");
                    const price = v.getFieldValue("price");
                    const { available } = items[i];
                    if (!available) {
                      v.setFieldValue(["item_prices", i, "price"], price);
                    }
                    return (
                      <Form.Item
                        label="Цена"
                        name={["item_prices", i, "price"]}
                        rules={[
                          {
                            required: true,
                            message: "Данное поле обязательно",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={!available || loading}
                          style={{ width: "100%" }}
                          placeholder="Введите цену"
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Скидка" name={["item_prices", i, "type"]}>
                  <Select placeholder="Выберите тип скидки" disabled={loading}>
                    <Select.Option value="1">Разрешить</Select.Option>
                    <Select.Option value="2">Запретить</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
          </div>
        ))}
      </Form>
    </Modal>
  );
};

export default Comp;
