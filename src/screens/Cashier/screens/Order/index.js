import React, { useEffect, useState } from "react";
import { Table, List, Tag, Divider, Tooltip, message } from "antd";
import { Button, Layout } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { columns } from "./data";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { CreditCardOutlined, WalletOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import _ from "lodash";
import { useNavigate } from "react-router";
import "./index.less";
import GuestSelect from "./GuestSelect";

const { Content, Sider, Footer } = Layout;

const Comp = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [guestVisible, setGuestVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu_items = useSelector((state) => state.app.menu_items || []);
  const current_shift = useSelector((state) => state.app.current_shift);
  const current_place = useSelector((state) => state.app.current_place);
  const menu_categories = useSelector(
    (state) => state.app.menu_categories || []
  );

  useEffect(() => {
    getCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getData();
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCategories = async () => {
    try {
      setLoading(true);
      const values = { place: current_place._id };
      const query = queryString.stringify(values);
      const { data } = await dispatch(
        call({ url: `menu_categories?${query}` })
      );
      dispatch(SET_APP(["menu_categories"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const values = {};
      if (selectedCategory) values.menu_category = selectedCategory;
      values.place = current_place._id;
      values.available = "1";

      const query = queryString.stringify(values);

      const { data } = await dispatch(call({ url: `menu_items?${query}` }));
      dispatch(SET_APP(["menu_items"], data));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onAddOrder = (item) => () => {
    const itemIndex = _.findIndex(orders, { _id: item._id });
    if (itemIndex !== -1) {
      const currentItem = _.find(menu_items, { _id: item._id });
      const _item = orders[itemIndex];
      const { amount } = _item;
      let nextAmount = amount + 1;
      if (nextAmount > currentItem?.wh_item_prices[0].amount) {
        nextAmount = amount;
      }
      orders[itemIndex] = { ...item, amount: nextAmount };
      setOrders([...orders]);
    } else {
      setOrders([...orders, { ...item, amount: 1 }]);
    }
  };

  const onDeleteOrder = (item) => () => {
    const itemIndex = _.findIndex(orders, { _id: item._id });
    const _item = orders[itemIndex];
    const { amount } = _item;
    if (amount === 1) {
      orders.splice(itemIndex, 1);
    } else {
      orders[itemIndex] = { ...item, amount: amount - 1 };
    }
    setOrders([...orders]);
  };

  const options = {
    amount: {
      render: (val, item) => {
        if (item.type === "1") return null;
        else if (item.wh_item_prices.length === 0) return 0;
        return item.wh_item_prices[0].amount;
      },
    },
    price: {
      render: (val, item) => {
        if (item.item_prices.length === 0) return null;
        return item.item_prices[0].price;
      },
    },
    actions: {
      render: (_, item) => {
        let disabled = false;

        if (item.type === "2") {
          if (item.wh_item_prices.length === 0) disabled = true;
          else if (item.wh_item_prices[0].amount <= 0) disabled = true;
        }

        if (item.item_prices.length > 0) {
          item.price = item.item_prices[0].price;
        }

        return (
          <Button
            disabled={disabled}
            type="link"
            size="small"
            onClick={onAddOrder(item)}
          >
            Добавить
          </Button>
        );
      },
    },
  };

  const onBack = () => {
    if (loading) return;
    navigate("/cashier/main");
  };

  const onAddCategory = (menu) => () => {
    if (loading) return;
    setSelectedCategory(menu._id);
  };

  const onPayment = async (values) => {
    const data = {
      ...values,
      orders,
      place: current_place._id,
      shift: current_shift._id,
    };

    try {
      messageApi.open({
        key,
        type: "loading",
        content: "Обрабатываем...",
      });
      setLoading(true);
      setGuestVisible(false);
      await dispatch(call({ url: `orders`, method: "POST", data }));
      messageApi.open({
        key,
        type: "success",
        content: "Заказ оформлен!",
        duration: 2,
      });
      getData();
      setOrders([]);
    } catch (e) {
      console.log(e.message);
      setLoading(false);
      messageApi.open({
        key,
        type: "error",
        content: "Ошибка! Невозможно оформить заказ",
        duration: 2,
      });
    }
  };

  const onPaymentSelect = (type) => () => {
    if (type === "2") {
      //card
      onPayment({ type });
    } else if (type === "3") {
      //guest
      setGuestVisible(true);
    } else if (type === "1") {
      //cash
      onPayment({ type });
    }
  };

  const onGuestSelect = (guest) => () => {
    const values = {
      guest,
      type: "3",
    };
    onPayment(values);
  };

  return (
    <>
      {contextHolder}
      <GuestSelect
        visible={guestVisible}
        setVisible={setGuestVisible}
        onSelect={onGuestSelect}
      />
      <Layout>
        <PageHeader title="Продажа товаров" ghost={false} onBack={onBack} />
        <Content className="main__content__layout">
          <div className="menu-item-picker">
            {menu_categories.map((menu) => {
              let color = "default";
              if (selectedCategory === menu._id) {
                color = "processing";
              }
              return (
                <Tag key={menu._id} onClick={onAddCategory(menu)} color={color}>
                  {menu.name}
                </Tag>
              );
            })}
          </div>
          <Table
            columns={columns(options)}
            rowKey="_id"
            dataSource={menu_items}
            loading={loading}
            pagination={false}
          />
        </Content>
      </Layout>
      <Sider theme="light" width={400} className="right-layout">
        <Layout className="order-sider-content">
          <Content>
            <List
              itemLayout="horizontal"
              dataSource={orders}
              locale={{ emptyText: "Товары не выбраны" }}
              className="order-list"
              loading={loading}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tooltip placement="left" title="Удалить товар">
                      <Button
                        type="link"
                        onClick={onDeleteOrder(item)}
                        disabled={loading}
                      >
                        <CloseOutlined />
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta title={item.name} />
                  <div>{`${item.amount}x${item.price}₸`}</div>
                </List.Item>
              )}
            />
          </Content>
          <Footer>
            <div className="ant-layout-content summary">
              <Divider />
              <List>
                <List.Item
                  actions={
                    [
                      // <Tooltip placement="left" key="disc" title="Задать скидку">
                      //   <Button
                      //     type="link"
                      //     disabled={loading || orders.length === 0}
                      //     onClick={() => setDiscountVisible(true)}
                      //   >
                      //     <PercentageOutlined />
                      //   </Button>
                      // </Tooltip>,
                    ]
                  }
                >
                  <List.Item.Meta title="Итого" />
                  <div>{_.sumBy(orders, (o) => o.amount * o.price)}₸</div>
                </List.Item>
              </List>
              <Divider />
            </div>
            <div className="buttons">
              <Button
                type="primary"
                disabled={loading || orders.length === 0}
                onClick={onPaymentSelect("1")}
              >
                <WalletOutlined />
                Наличные
              </Button>
              <Button
                type="primary"
                disabled={loading || orders.length === 0}
                onClick={onPaymentSelect("2")}
              >
                <CreditCardOutlined />
                Картой
              </Button>
              <Button
                type="primary"
                disabled={loading || orders.length === 0}
                onClick={onPaymentSelect("3")}
              >
                <UserOutlined />
                На гостя
              </Button>
            </div>
          </Footer>
        </Layout>
      </Sider>
    </>
  );
};

export default Comp;
