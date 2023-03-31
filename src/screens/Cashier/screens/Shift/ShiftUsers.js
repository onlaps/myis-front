import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Modal, Form, Typography } from "antd";
import { Button, Select, DatePicker, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import queryString from "query-string";
import _ from "lodash";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const { Title } = Typography;

const ShiftUsers = (props) => {
  const { isClosing, setIsClosing } = props;
  const [loading, setLoading] = useState(false);

  const current_shift = useSelector((state) => state.app.current_shift);
  const current_place = useSelector((state) => state.app.current_place);
  const user = useSelector((state) => state.app.user);
  const users = useSelector((state) => state.app.users || []);

  const form = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedUsers = Form.useWatch("users", form.current);

  useEffect(() => {
    if (form.current) {
      form.current.setFieldsValue({
        users: [
          {
            user: user._id,
            date: [dayjs(current_shift.createdAt), dayjs()],
          },
        ],
      });
    }
    if (isClosing) {
      const getUsers = async () => {
        try {
          const values = { place: current_place._id };
          const query = queryString.stringify(values);
          const { data } = await dispatch(call({ url: `users/all?${query}` }));
          dispatch(SET_APP(["users"], data));
        } catch (e) {}
      };
      getUsers();
    }
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCancel = () => setIsClosing(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.current.validateFields();
      values.closed = true;

      const shift_users = [];

      for (let i = 0; i < values.users.length; i++) {
        const user = values.users[i];
        var start = dayjs(user.date[0]);
        var end = dayjs(user.date[1]);

        const duration = end.diff(start, "minutes");

        const start_time = start.format("YYYY-MM-DD HH:mm");
        const end_time = end.format("YYYY-MM-DD HH:mm");
        shift_users.push({ ...user, time: [start_time, end_time], duration });
      }

      values.users = shift_users;
      values.place = current_place._id;

      await dispatch(
        call({
          url: `shifts/${current_shift._id}`,
          method: "PATCH",
          data: values,
        })
      );
      setLoading(false);
      navigate("/cashier/main");
      dispatch(SET_APP(["current_shift"], null));
    } catch (e) {
      setLoading(false);
    }
  };

  const getUsers = () => {
    return users.map((u) => {
      const isSelected = _.find(selectedUsers, { user: u._id });

      return { ...u, disabled: isSelected };
    });
  };

  return (
    <Modal
      okText="Сохранить"
      open={isClosing}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      onCancel={onCancel}
      onOk={onSubmit}
      title="Рабочее время"
    >
      <Title level={5}>Отметьте сотрудников, которые отработали сегодня</Title>
      <Form layout="vertical" ref={form}>
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <Row key={index}>
                    <Col span={24}>
                      <Space align="start">
                        <Form.Item
                          {...field}
                          label="Сотрудник"
                          key={`${index} ${field.key} user`}
                          name={[field.name, "user"]}
                          rules={[
                            {
                              required: true,
                              message: "Обязательно",
                            },
                          ]}
                        >
                          <Select disabled={loading} style={{ width: 150 }}>
                            {getUsers().map((v) => (
                              <Select.Option
                                key={v._id}
                                value={v._id}
                                disabled={v.disabled}
                              >
                                {v.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="Начало"
                          key={`${index} ${field.key} date`}
                          name={[field.name, "date"]}
                          rules={[
                            {
                              required: true,
                              message: "Обязательно",
                            },
                          ]}
                        >
                          <RangePicker
                            showTime={{ format: "HH:mm" }}
                            format="DD MMM, HH:mm"
                            disabled={loading}
                          />
                        </Form.Item>
                        <Form.Item label=" " {...field}>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                            disabled={loading}
                          />
                        </Form.Item>
                      </Space>
                    </Col>
                  </Row>
                );
              })}

              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => add()}
                  disabled={loading}
                  icon={<PlusOutlined />}
                >
                  Добавить сотрудника
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ShiftUsers;
