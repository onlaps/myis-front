import React, { useEffect, useState } from "react";
import { Layout, PageHeader, Card, Button, Select } from "antd";
import { Table, Popover, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { columns } from "./data";
import "./index.less";
import { call } from "@/actions/axios";
import { REMOVE_APP_BY_PARAM } from "@/actions/app";
import NewGuest from "../NewGuest";
import moment from "moment";
import _ from "lodash";
import GuestCards from "./GuestCards";

const { Content } = Layout;

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
    setGuestOpenTime(moment().format("YYYY-MM-DD HH:mm"));
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
  const disabled = guest._id;

  const [loading, setLoading] = useState(false);

  const guestToOption = (guests) => {
    return _.filter(guests, (o) => o.table._id === guest.table._id).map(
      (guest) => {
        return {
          label: guest.name,
          value: guest._id,
          disabled: disabled === guest._id,
        };
      }
    );
  };

  const dispatch = useDispatch();

  const [selected, setSelected] = useState([guest._id]);
  // const [filters, setFilters] = useState(null);
  // const [pagination, setPagination] = useState(null);
  // const [sorter, setSorter] = useState(null);

  const guests = useSelector((state) => state.app.guests || []);
  const guestList = _.filter(guests, (o) => selected.indexOf(o._id) !== -1);

  const onBack = () => {
    if (loading) return;
    setGuest(null);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await dispatch(call({ url: `guests/${guest.id}`, method: "DELETE" }));
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
    const disabled = moment().diff(moment(guest.createdAt), "minutes");

    return (
      <Button
        type="danger"
        ghost
        key="delete"
        disabled={disabled > 5 || loading}
        onClick={onDelete}
      >
        Удалить
      </Button>
    );
  };

  const onChange = (value) => {
    setSelected(value);
  };

  const calculateTime = (item) => {
    const start_at = moment(item.createdAt);
    const end_at = moment(guestOpenTime);
    var duration = moment.duration(end_at.diff(start_at));
    return Math.round(duration.asMinutes()) * item?.room?.tariff?.hour;
  };

  const options = {
    table: {
      render: (val) => {
        return `#${val.number} - ${val.name}`;
      },
    },
    tariff: {
      render: (val, item) => {
        return item?.room?.tariff?.name;
      },
    },
    time: {
      render: (val, item) => {
        const start_at = moment(item.createdAt).format("HH:mm");
        const end_at = moment(guestOpenTime).format("HH:mm");
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

  return (
    <>
      <Layout>
        <PageHeader
          title="Гости"
          ghost={false}
          onBack={onBack}
          extra={[
            deleteButton(),
            <Button key="reassign" loading={loading}>
              Записать на другого
            </Button>,
            <Button key="move" loading={loading}>
              Переместить
            </Button>,
          ]}
        />
        <Content className="main__content__layout">
          <Card>
            <Select
              mode="multiple"
              style={{ width: "100%", marginBottom: 16 }}
              value={selected}
              options={guestToOption(guests)}
              onChange={onChange}
              disabled={loading}
            />
            <Table
              columns={columns(options)}
              loading={loading}
              // onChange={onChange}
              rowKey="_id"
              dataSource={guestList}
              pagination={false}
            />
          </Card>
        </Content>
      </Layout>
    </>
  );
};

export default Comp;
