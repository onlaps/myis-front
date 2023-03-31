import React, { useEffect, useRef, useState } from "react";
import { Layout, Card, Button, Select, Typography } from "antd";
import { Row, Col, List, InputNumber } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Table, Popover, notification, Tooltip, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { columns } from "./data";
import { call } from "@/actions/axios";
import { REMOVE_APP_BY_PARAM } from "@/actions/app";
import { CreditCardOutlined, WalletOutlined } from "@ant-design/icons";
import NewGuest from "../NewGuest";
import DiscountSelect from "./DiscountSelect";
import dayjs from "dayjs";
import _ from "lodash";
import GuestCards from "./GuestCards";
import Move from "./Move";
import Reassign from "./Reassign";
import Promocode from "./Promocode";
import Prepaid from "./Prepaid";
import Pause from "./Pause";
import Tariff from "./Tariff";

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

  const [messageApi, contextHolder] = message.useMessage();

  const cash = useRef();
  const card = useRef();

  const [loading, setLoading] = useState(false);
  // const [comment, setComment] = useState(null);
  const [discountVisible, setDiscountVisible] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [moveVisible, setMoveVisible] = useState(false);
  const [reasVisible, setReasVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);

  const [promocode, setPromocode] = useState(null);

  const [prepaidVisible, setPrepaidVisible] = useState(false);
  const [prepaid, setPrepaid] = useState(null);
  const [cashValue, setCashValue] = useState(0);
  const [cardValue, setCardValue] = useState(0);

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

  const current_shift = useSelector((state) => state.app.current_shift);
  const guests = useSelector((state) => state.app.guests || []);
  const guestList = _.filter(guests, (o) => selected.indexOf(o._id) !== -1);

  const onBack = () => {
    if (loading) return;
    setGuest(null);
  };

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

    const MIN = 5;
    const isDisabled = time > MIN;

    let title = `После ${MIN} мин невозможно удалить`;
    if (!isDisabled) title = "";

    return (
      <Tooltip key="delete" placement="bottom" title={title}>
        <Button
          danger
          ghost
          disabled={isDisabled || loading}
          onClick={onDelete}
        >
          Удалить
        </Button>
      </Tooltip>
    );
  };

  const onChange = (value) => {
    let selected = [];
    value.forEach((_id) => {
      const guest = _.find(guests, { _id });
      if (!guest.assigned) {
        selected.push(_id);
        if (guest.guests.length > 0) {
          selected = [...selected, ...guest.guests];
        }
      }
    });

    setSelected(selected);
  };

  // useEffect(() => {
  //   if (!discount) setComment(null);
  // }, [discount]);

  const calculateTime = (item) => {
    const start_at = dayjs(item.createdAt);
    let end_at;
    if (item.closedAt) {
      end_at = dayjs(item.closedAt);
    } else {
      if (item.pausedAt) {
        end_at = dayjs(item.pausedAt);
      } else {
        end_at = dayjs(guestOpenTime);
      }
    }

    const duration = end_at.diff(start_at, "minutes");

    let sum = duration * tariff.hour;

    if (sum < tariff.min) sum = tariff.min;
    else if (sum > tariff.max) sum = tariff.max;

    return { duration, sum };
  };

  const options = {
    time: {
      render: (val, item) => {
        const start_at = dayjs(item.createdAt).format("HH:mm");
        let end_at;
        if (item.closedAt) {
          end_at = dayjs(item.closedAt).format("HH:mm");
        } else {
          if (item.pausedAt) {
            end_at = dayjs(item.pausedAt).format("HH:mm");
          } else {
            end_at = dayjs(guestOpenTime).format("HH:mm");
          }
        }
        return `${start_at} - ${end_at}`;
      },
    },
    timemoney: {
      render: (val, item) => {
        return calculateTime(item).sum;
      },
    },
    items: {
      render: (val) => {
        if (val.length === 0) return null;

        const renderItem = (v) => {
          if (v.wh_item) {
            return (
              <div key={v._id}>
                {v.wh_item.name} ({v.amount} x {v.wh_item.wh_unit.name}) -{" "}
                {v.total} ₸
              </div>
            );
          } else if (v.expense_category) {
            return (
              <div key={v._id}>
                {v.expense_category.name} - {v.total} ₸
              </div>
            );
          } else if (v.menu_item) {
            return (
              <div key={v._id}>
                {v.menu_item.name} ({v.amount} x {v.price}) - {v.total} ₸
              </div>
            );
          }
        };
        return (
          <Popover
            content={val.map(renderItem)}
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
          calculateTime(item).sum +
          _.sumBy(item.items, (o) => o.amount * o.price)
        );
      },
    },
  };

  const sumByItemsTotal = () => {
    let sum = _.sumBy(guestList, (g) => {
      return _.sumBy(g.items, (o) => {
        return o.amount * o.price;
      });
    });

    return sum;
  };

  const sumByItems = () => {
    let sum = _.sumBy(guestList, (g) => {
      return _.sumBy(g.items, (o) => {
        let d = 1;
        if (discount) {
          if (discount.discount_type !== "2") {
            if (discount.discount_type.menu_type === "1") {
              d = discountValue();
            } else if (discount.menu_categories.indexOf(o.menu_category)) {
              d = discountValue();
            }
          }
        }
        return o.amount * o.price * d;
      });
    });

    return sum;
  };

  const discountValue = () => {
    if (discount) {
      return (100 - discount.discount) / 100;
    }
    return 1;
  };

  const sumByHoursTotal = () => {
    return _.sumBy(guestList, (g) => {
      return calculateTime(g).sum;
    });
  };

  const sumByHours = () => {
    let sum = _.sumBy(guestList, (g) => {
      return calculateTime(g).sum;
    });

    if (discount && discount.discount_type !== "3") {
      if (
        (!tariff.use_max && !tariff.use_min) ||
        (tariff.use_max && sum >= tariff.max) ||
        (tariff.use_min && sum <= tariff.min) ||
        (discount && sum >= discount.min)
      ) {
        sum = sum * discountValue();
      }
    }

    return sum;
  };

  const total = () => {
    let sum = sumByItems() + sumByHours();

    if (prepaid) {
      sum = sum - prepaid.prepay;
    }

    const rounded = Math.ceil(sum / tariff?.round) * tariff.round;

    return rounded;
  };

  const onDeleteDiscount = () => {
    setDiscount(null);
    setPromocode(null);
  };

  const key = "updatable";

  const onSubmit = async () => {
    const sum = cashValue + cardValue;
    if (total() !== sum) {
      return notification.warning({
        message: "Не совпадают суммы!",
        description: "Проверьте корректность введенных данных",
      });
    }

    const data = {
      cashValue,
      cardValue,
      itemsSum: sumByItems(),
      hoursSum: sumByHours(),
      itemsSumTotal: sumByItemsTotal(),
      hoursSumTotal: sumByHoursTotal(),
      guests: guestList.map((g) => ({
        ...g,
        ...calculateTime(g),
        item_service_sum: _.sumBy(g.items, (o) => {
          let d = 1;
          if (discount) {
            if (discount.discount_type !== "2") {
              if (discount.discount_type.menu_type === "1") {
                d = discountValue();
              } else if (discount.menu_categories.indexOf(o.menu_category)) {
                d = discountValue();
              }
            }
          }
          return o.amount * o.price * d;
        }),
      })),
      prepaid,
      discount: discount?._id,
      promocode,
      guestOpenTime,
      shift: current_shift._id,
      place: current_shift?.place?._id,
      tariff: tariff?._id,
    };

    try {
      setLoading(true);
      messageApi.open({
        key,
        type: "loading",
        content: "Обрабатываем...",
      });
      await dispatch(call({ url: `guests/cashout`, method: "POST", data }));
      messageApi.open({
        key,
        type: "success",
        content: "Готово!",
        duration: 2,
      });
      setGuest(null);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
      messageApi.open({
        key,
        type: "error",
        content: "Ошибка!",
        duration: 2,
      });
    }
  };

  const setValue = (type) => (v) => {
    const diff = (a, b) => (a - b < 0 ? 0 : a - b);
    if (type === "cash") {
      setCashValue(v);
      setCardValue(diff(total(), v));
    } else {
      setCardValue(v);
      setCashValue(diff(total(), v));
    }
  };

  return (
    <>
      {contextHolder}
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
          selected={selected}
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
            <Pause
              key="pause"
              guest={guest}
              setGuest={setGuest}
              loading={loading}
            />,
            <Button
              ghost
              type="primary"
              key="reassign"
              disabled={loading}
              onClick={() => setReasVisible(true)}
            >
              Записать на другого
            </Button>,
            <Button
              ghost
              type="primary"
              key="move"
              disabled={loading}
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
          guest={guest}
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
              <Tariff tariff={tariff} setTariff={setTariff} loading={loading} />
              <Card title={`Скидка`}>
                <Title level={5}>
                  {discount
                    ? `${discount.name} (${discount.discount}%)`
                    : "Скидка не выбрана"}
                </Title>
                <Button
                  type="link"
                  onClick={() => setDiscountVisible(true)}
                  disabled={loading}
                >
                  Изменить
                </Button>
                <Button
                  type="link"
                  disabled={!discount || loading}
                  onClick={onDeleteDiscount}
                >
                  Убрать скидку
                </Button>
                {/*discount && discount.comment && (
                  <>
                    <Divider />
                    <Input.TextArea
                      comment={comment}
                      onChange={setComment}
                      disabled={comment}
                      placeholder="Введите комментарий"
                    />
                  </>
                )*/}
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
              <Card title="Расчет" style={{ marginBottom: 16 }}>
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
                    <Button
                      type="link"
                      onClick={() => setPromoVisible(true)}
                      disabled={loading}
                    >
                      {promocode ? promocode.code : "Ввести промокод"}
                    </Button>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Предоплата" />
                    <Button
                      type="link"
                      onClick={() => setPrepaidVisible(true)}
                      disabled={loading}
                    >
                      {prepaid ? prepaid.prepay : "Найти предоплату"}
                    </Button>

                    {prepaid && (
                      <DeleteOutlined
                        onClick={() => setPrepaid(null)}
                        disabled={loading}
                      />
                    )}
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
              <InputNumber
                ref={cash}
                size="large"
                placeholder="Введите сумму наличных"
                style={{ marginTop: 16, width: "100%" }}
                addonBefore={
                  <div style={{ width: 120, textAlign: "right" }}>
                    <WalletOutlined />
                    <span style={{ marginLeft: 5 }}>Наличными:</span>
                  </div>
                }
                value={cashValue}
                onChange={setValue("cash")}
                disabled={loading}
                min={0}
              />
              <InputNumber
                ref={card}
                size="large"
                placeholder="Введите сумму по карте"
                style={{ marginTop: 16, width: "100%" }}
                addonBefore={
                  <div style={{ width: 120, textAlign: "right" }}>
                    <CreditCardOutlined />
                    <span style={{ marginLeft: 5 }}>Картой:</span>
                  </div>
                }
                value={cardValue}
                onChange={setValue("card")}
                disabled={loading}
                min={0}
              />
              <Button
                type="primary"
                size="large"
                block
                disabled={loading}
                onClick={onSubmit}
                style={{ marginTop: 16 }}
              >
                Рассчитать
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default Comp;
