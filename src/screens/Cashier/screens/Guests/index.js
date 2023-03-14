import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Select, Typography } from "antd";
import { Row, Col, List } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Table, Popover, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { REMOVE_APP_BY_PARAM, SET_APP } from "@/actions/app";
import NewGuest from "../NewGuest";
import DiscountSelect from "./DiscountSelect";
import dayjs from "dayjs";
import _, { max, min } from "lodash";
import GuestCards from "./GuestCards";
import Move from "./Move";
import Reassign from "./Reassign";
import Promocode from "./Promocode";
import Prepaid from "./Prepaid";

const { Content } = Layout;
const { Title } = Typography;

const Comp = () => {
  const [newGuest, setNewGuest] = useState(false);
  const [guest, setGuest] = useState(null);
  const [guestOpenTime, setGuestOpenTime] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!guest) setGuestOpenTime(null);
  }, [guest]);

  const onBack = () => {
    navigate("/cashier/main");
  };

  const onGuestSelect = (guest) => () => {
    setGuestOpenTime(dayjs().format("YYYY-MM-DD HH:mm"));
    setGuest(guest);
  };

  const onClick = () => setNewGuest(true);

  if (guest)
    return (
      <GuestPage
        guest={guest}
        setGuest={setGuest}
        guestOpenTime={guestOpenTime}
      />
    );

  return (
    <>
      <Layout>
        <PageHeader
          title="Гости"
          ghost={false}
          onBack={onBack}
          extra={[
            <Button type="primary" key="new" onClick={onClick}>
              Новый гость
            </Button>,
          ]}
        />
        <NewGuest newGuest={newGuest} setNewGuest={setNewGuest} />
        <Content className="main__content__layout">
          <GuestCards onSelect={onGuestSelect} />
        </Content>
      </Layout>
    </>
  );
};

const GuestPage = (props) => {
  const { guest, setGuest, guestOpenTime } = props;

  const [loading, setLoading] = useState(false);
  const [discountVisible, setDiscountVisible] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [moveVisible, setMoveVisible] = useState(false);
  const [reasVisible, setReasVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);

  const [promocode, setPromocode] = useState(null);

  const [prepaidVisible, setPrepaidVisible] = useState(false);
  const [prepaid, setPrepaid] = useState(null);

  const guestToOption = (guests) => {
    return _.filter(guests, (o) => o.table._id === guest.table._id).map((g) => {
      const { _id, name, assigned } = g;
      return {
        value: _id,
        label: name,
        disabled: _id === guest._id || assigned,
      };
    });
  };

  const dispatch = useDispatch();

  const [selected, setSelected] = useState([guest._id, ...guest.guests]);
  const [tariff, setTariff] = useState(guest.room.tariff);

  const guests = useSelector((state) => state.app.guests || []);
  const guestList = _.filter(guests, (o) => selected.indexOf(o._id) !== -1);
  const tariffs = useSelector((state) => state.app.tariffs || []);

  const onBack = () => {
    if (loading) return;
    setGuest(null);
  };

  useEffect(() => {
    const getData = async () => {
      const { data } = await dispatch(call({ url: `tariffs` }));

      dispatch(SET_APP(["tariffs"], data));
    };
    getData();
  }, []);

  const onDelete = async () => {
    try {
      setLoading(true);
      await dispatch(call({ url: `guests/${guest._id}`, method: "DELETE" }));
      dispatch(REMOVE_APP_BY_PARAM(["guests"], "_id", guest._id));
      setLoading(false);
      onBack();
    } catch (e) {
      setLoading(false);
      notification.error({
        message: "Ошибка",
        description: "Не удалось удалить",
      });
    }
  };

  const deleteButton = () => {
    if (!guest) return;
    const time = dayjs().diff(dayjs(guest.createdAt), "minutes");

    return (
      <Button
        danger
        ghost
        key="delete"
        disabled={time > 5 || loading}
        onClick={onDelete}
      >
        Удалить
      </Button>
    );
  };

  const onChange = (value) => {
    setSelected(value);
  };

  const calculateTime = (item, with_discount = false) => {
    let rate = 1;
    let duration = 0;

    const start_at = dayjs(item.createdAt);
    let end_at;
    if (item.closedAt) {
      end_at = dayjs(item.closedAt);
    } else end_at = dayjs(guestOpenTime);

    if (with_discount) {
      if (discount) {
        const dow = dayjs().day();
        const day = dow === 0 ? 7 : dow;
        if (discount.days.indexOf(day) !== -1) {
          let hour, minute;
          [hour, minute] = discount.time_from.split(":");
          let d_start_at = dayjs().set("hour", hour).set("minute", minute);
          [hour, minute] = discount.time_to.split(":");
          let d_end_at = dayjs().set("hour", hour).set("minute", minute);

          const isBefore = start_at.isBefore(d_start_at);
          const isAfter = end_at.isAfter(d_end_at);
          rate = (100 - discount.discount) / 100;

          if (isBefore) {
            duration = d_start_at.diff(start_at, "minutes");
            if (!isAfter) {
              duration += d_end_at.diff(d_start_at, "minutes") * rate;
            } else {
              duration += d_end_at.diff(d_start_at, "minutes") * rate;
              duration += end_at.diff(d_end_at, "minutes");
            }
          } else if (!isBefore) {
            if (isAfter) {
              duration = d_end_at.diff(start_at, "minutes") * rate;
              duration += end_at.diff(d_end_at, "minutes");
            } else {
              duration = end_at.diff(start_at, "minutes") * rate;
            }
          }
        }
      }
    } else {
      duration = end_at.diff(start_at, "minutes");
    }
    return duration * tariff?.hour;
  };

  const options = {
    time: {
      render: (val, item) => {
        const start_at = dayjs(item.createdAt).format("HH:mm");
        let end_at;
        if (item.closedAt) {
          end_at = dayjs(item.closedAt).format("HH:mm");
        } else end_at = dayjs(guestOpenTime).format("HH:mm");
        return `${start_at} - ${end_at}`;
      },
    },
    timemoney: {
      render: (val, item) => {
        return calculateTime(item);
      },
    },
    items: {
      render: (val) => {
        if (!_.isArray(val) || val.length === 0) return 0;
        return (
          <Popover
            content={val.map((v) => {
              return (
                <div key={v._id}>
                  {v.wh_item.name} ({v.amount} x {v.price})
                </div>
              );
            })}
            trigger="hover"
            placement="bottom"
          >
            <Button type="link">{val.length}</Button>
          </Popover>
        );
      },
    },
    itemsmoney: {
      render: (val, item) => {
        return _.sumBy(item.items, (o) => o.amount * o.price);
      },
    },
    total: {
      render: (val, item) => {
        return (
          calculateTime(item) + _.sumBy(item.items, (o) => o.amount * o.price)
        );
      },
    },
  };

  const sumByItems = (with_discount = false) => {
    const sum = _.sumBy(guestList, (gl) => {
      return _.sumBy(gl.items, (o) => o.amount * o.price);
    });

    return sum;
  };

  const sumByHours = (with_discount = false) => {
    const sum = _.sumBy(guestList, (gl) => {
      return calculateTime(gl, with_discount);
    });

    return sum;
  };

  const total = () => {
    let sum = sumByItems() + sumByHours();

    if (discount) {
      if (sum > discount.min) {
        sum = sumByItems(true) + sumByHours(true);
      }
    }

    // const rounded = Math.round(sum / tariff?.round) * tariff.round;
    // if (rounded > tariff.max) return tariff.max;

    // if (rounded < min) return tariff.min;

    return sum;
  };

  return (
    <>
      <Layout>
        <Move
          visible={moveVisible}
          setVisible={setMoveVisible}
          guest={guest}
          setGuest={setGuest}
        />
        <Reassign
          visible={reasVisible}
          setVisible={setReasVisible}
          guest={guest}
          setGuest={setGuest}
        />
        <Promocode
          visible={promoVisible}
          setVisible={setPromoVisible}
          promocode={promocode}
          setPromocode={setPromocode}
          setDiscount={setDiscount}
        />
        <Prepaid
          visible={prepaidVisible}
          setVisible={setPrepaidVisible}
          setPrepaid={setPrepaid}
        />
        <PageHeader
          title={`Гость - ${guest.name}`}
          ghost={false}
          onBack={onBack}
          extra={[
            deleteButton(),
            <Button
              ghost
              type="primary"
              key="reassign"
              loading={loading}
              onClick={() => setReasVisible(true)}
            >
              Записать на другого
            </Button>,
            <Button
              ghost
              type="primary"
              key="move"
              loading={loading}
              onClick={() => setMoveVisible(true)}
            >
              Переместить
            </Button>,
          ]}
        />
        <DiscountSelect
          visible={discountVisible}
          setVisible={setDiscountVisible}
          onSelect={(v) => setDiscount(v)}
          selected={discount}
          orders={[]}
        />
        <Content className="main__content__layout">
          <Row gutter={[20, 20]} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card
                title={`Комната ${guest.room.name}, стол #${guest.table.number} ${guest.table.name}`}
                style={{ marginBottom: 16 }}
              >
                <Title level={5}>Управление гостями в чеке</Title>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  value={selected}
                  options={guestToOption(guests)}
                  onChange={onChange}
                  disabled={loading}
                />
              </Card>
              <Card title={`Тариф`} style={{ marginBottom: 16 }}>
                <Title level={5}>Выберите тариф</Title>
                <Select
                  style={{ width: "100%" }}
                  value={tariff._id}
                  onChange={(_id) => setTariff(_.find(tariffs, { _id }))}
                  disabled={loading}
                >
                  {tariffs.map((v) => (
                    <Select.Option key={v._id} value={v._id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Card>
              <Card title={`Скидка`}>
                <Title level={5}>
                  {discount
                    ? `${discount.name} (${discount.discount}%)`
                    : "Скидка не выбрана"}
                </Title>
                <Button type="link" onClick={() => setDiscountVisible(true)}>
                  Изменить
                </Button>
                <Button
                  type="link"
                  disabled={!discount}
                  onClick={() => setDiscount(null)}
                >
                  Убрать скидку
                </Button>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Список гостей">
                <Table
                  columns={columns(options)}
                  loading={loading}
                  rowKey="_id"
                  dataSource={guestList}
                  pagination={false}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card title={`Расчет`} style={{ marginBottom: 16 }}>
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta title="Сумма за товары" />
                    <div>{sumByItems()}</div>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Сумма за часы" />
                    <div>{sumByHours()}</div>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Общая сумма" />
                    <Title level={5}>{sumByItems() + sumByHours()}</Title>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Промокод" />
                    <Button type="link" onClick={() => setPromoVisible(true)}>
                      {promocode ? promocode.code : "Ввести промокод"}
                    </Button>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Предоплата" />
                    <Button type="link" onClick={() => setPrepaidVisible(true)}>
                      {prepaid ? prepaid.prepay : "Найти предоплату"}
                    </Button>
                  </List.Item>
                </List>
              </Card>
              <Card>
                <List itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta title="К оплате" />
                    <Title level={5}>{total()}</Title>
                  </List.Item>
                </List>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default Comp;
