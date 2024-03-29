import React, { createContext, useContext } from "react";
import { useEffect, useRef, useState } from "react";
import { Modal, Segmented, List, Tooltip } from "antd";
import { Checkbox, Input, Card, message } from "antd";
import MaskedInput from "antd-mask-input";
import { SearchOutlined } from "@ant-design/icons";
import { call } from "@/actions/axios";
import { PUSH_APP } from "@/actions/app";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@/ui";
import dayjs from "dayjs";
import _ from "lodash";
import "./index.less";

const CTX = createContext();

const NewGuest = (props) => {
  const { newGuest, setNewGuest } = props;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [client, setClient] = useState(null);
  const [unknown, setUnknown] = useState(null);

  const dispatch = useDispatch();
  const current_shift = useSelector((state) => state.app.current_shift);
  const current_place = useSelector((state) => state.app.current_place);

  const textRenderer = () => {
    if (step === 1) return "Далее";
  };

  const onSubmit = async () => {
    if (step === 1) setStep(2);
    else {
      try {
        setLoading(true);
        const values = {
          table: selected._id,
          room: selected.room,
          shift: current_shift._id,
          place: current_place._id,
        };

        if (unknown) values.name = unknown;
        else if (client) {
          values.card = client._id;
          values.name = client.name;
        }

        const { data } = await dispatch(
          call({ url: `guests`, method: "POST", data: values })
        );
        dispatch(PUSH_APP(["guests"], data));
        setNewGuest(false);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      onSubmit();
    }
  };

  useEffect(() => {
    if (!newGuest) {
      setStep(1);
      setSelected(null);
      setClient(null);
      setUnknown(null);
    }
  }, [newGuest]);

  const setDisabled = () => {
    if (loading) return true;
    if (!client && !unknown && step === 1) return true;
    else if (!selected && step === 2) return true;

    return false;
  };

  return (
    <Modal
      open={newGuest}
      okText={textRenderer()}
      destroyOnClose={true}
      title="Новый гость"
      width={step === 1 ? 600 : 800}
      okButtonProps={{ disabled: setDisabled(), loading }}
      cancelButtonProps={{ disabled: loading }}
      onCancel={() => setNewGuest(false)}
      onOk={onSubmit}
    >
      <CTX.Provider
        value={{
          setClient,
          unknown,
          setUnknown,
          handleKeyUp,
        }}
      >
        {step === 1 && <Find loading={loading} />}
        {step === 2 && (
          <Table
            loading={loading}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </CTX.Provider>
    </Modal>
  );
};

const Find = () => {
  const { setClient, setUnknown } = useContext(CTX);
  const [tab, setTab] = useState(0);
  const options = [
    { label: "По телефону", value: 0 },
    { label: "По фамилии", value: 1 },
    { label: "Без карты", value: 2 },
  ];

  const onChange = (e) => {
    setTab(e);
    setClient(null);
  };

  useEffect(() => {
    setClient(null);
    setUnknown(null);
  }, [tab]); //eslint-disable-line

  return (
    <>
      <Segmented block options={options} onChange={onChange} value={tab} />
      <div style={{ margin: "12px 0" }}>
        {tab === 0 && <ByPhone />}
        {tab === 1 && <ByName />}
        {tab === 2 && <Unknown />}
      </div>
    </>
  );
};

const ByPhone = () => {
  const { setClient } = useContext(CTX);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [searching, setSearching] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const timer = useRef();
  const guests = useSelector((state) => state.app.guests || []);

  const onChange = (e) => {
    setValue(e.maskedValue.slice(1));
    setSearching(e.unmaskedValue.length === 10);
  };

  useEffect(() => {
    if (searching && value) {
      clearTimeout(timer.current);
      timer.current = setTimeout(onSearch, 500);
    }
    if (!searching) setCompleted(false);
  }, [searching, value]); //eslint-disable-line

  const onSearch = async () => {
    setLoading(true);
    const { data } = await dispatch(call({ url: `cards?search=${value}` }));
    setLoading(false);
    setCompleted(true);
    setData(data);
  };

  const onCheck = (item) => (e) => {
    setClient(item);
  };

  return (
    <>
      <MaskedInput
        mask="+7 000 000 00 00"
        style={{ width: "100%" }}
        onChange={onChange}
        addonAfter={<SearchOutlined />}
        disabled={loading}
        size="large"
      />
      {completed && (
        <List
          itemLayout="horizontal"
          dataSource={data}
          rowKey="_id"
          renderItem={(item) => (
            <List.Item>
              <TTCheckbox guests={guests} item={item} onCheck={onCheck(item)} />
              <List.Item.Meta title={item.phone} description={item.name} />
            </List.Item>
          )}
        />
      )}
    </>
  );
};

const TTCheckbox = ({ guests, item, onCheck }) => {
  if (guests) {
    const isExists = _.find(guests, (o) => {
      if (o.card && o.card._id === item._id) return true;
      return false;
    });
    if (isExists) {
      return (
        <Tooltip title="Гость добавлен">
          <Checkbox
            disabled={true}
            onChange={onCheck}
            style={{ marginRight: 16 }}
          />
        </Tooltip>
      );
    }
  }

  return <Checkbox onChange={onCheck} style={{ marginRight: 16 }} />;
};

const ByName = () => {
  const { setClient } = useContext(CTX);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const timer = useRef();
  const guests = useSelector((state) => state.app.guests || []);

  const onChange = (e) => {
    setValue(e.target.value);
    setCompleted(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(onSearch, 500);
  };

  const onSearch = async () => {
    if (value.length < 2) return;
    setLoading(true);
    const { data } = await dispatch(call({ url: `cards?search=${value}` }));
    setLoading(false);
    setCompleted(true);
    setData(data);
  };

  const onCheck = (item) => (e) => {
    setClient(item);
  };

  return (
    <>
      <Input
        style={{ width: "100%" }}
        onChange={onChange}
        addonAfter={<SearchOutlined />}
        disabled={loading}
        size="large"
      />
      {completed && (
        <List
          itemLayout="horizontal"
          dataSource={data}
          rowKey="_id"
          renderItem={(item) => (
            <List.Item>
              <TTCheckbox guests={guests} item={item} onCheck={onCheck(item)} />
              <List.Item.Meta title={item.phone} description={item.name} />
            </List.Item>
          )}
        />
      )}
    </>
  );
};

const Unknown = () => {
  const { unknown, setUnknown, handleKeyUp } = useContext(CTX);

  const onChange = (e) => {
    setUnknown(e.target.value);
  };

  return (
    <>
      <Input
        style={{ width: "100%" }}
        onChange={onChange}
        placeholder="Введите имя клиента"
        value={unknown}
        onKeyUp={handleKeyUp}
        size="large"
      />
    </>
  );
};

export const Table = (props) => {
  const { selected, setSelected, loading: $loading } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const current_place = useSelector((state) => state.app.current_place);

  const getRooms = async () => {
    try {
      setLoading(true);
      const values = { place: current_place._id };
      const query = queryString.stringify(values);
      const { data } = await dispatch(call({ url: `rooms?${query}` }));
      const rooms = _.groupBy(data, "name");
      setLoading(false);
      setRooms(rooms);
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRooms();
  }, []); //eslint-disable-line

  const gridStyle = {
    width: "25%",
    textAlign: "center",
  };

  const onClick = (table, room) => () => {
    if ($loading) return;
    const dow = dayjs().day();
    const day = dow === 0 ? 6 : dow;

    const isEnabled = room.tariff.days_of_week.indexOf(day) !== -1;

    if (isEnabled) {
      setSelected(table);
    } else {
      messageApi.open({
        type: "warning",
        content: "На текущий день недоступен тарифный план под данный зал",
      });
    }
  };

  if (loading) return <Loading />;

  const render = () => {
    return Object.keys(rooms).map((key) => {
      const room = rooms[key][0];
      return (
        <div key={key}>
          <Card title={key} className="room" bordered={false}>
            {room.tables.map((table) => {
              const classNames = ["table"];
              if (selected && selected._id === table._id)
                classNames.push("selected");
              return (
                <Card.Grid
                  key={table._id}
                  className={classNames.join(" ")}
                  style={{ ...gridStyle, backgroundColor: table.color }}
                  onClick={onClick(table, room)}
                >
                  {`#${table.number}`}
                  <br />
                  {`${table.name}`}
                </Card.Grid>
              );
            })}
          </Card>
        </div>
      );
    });
  };

  return (
    <>
      {contextHolder}
      {render()}
    </>
  );
};

export default NewGuest;
