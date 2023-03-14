import React from "react";
import { Modal, List, Button } from "antd";
import { call } from "@/actions/axios";
import MaskedInput from "antd-mask-input";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { useEffect } from "react";

const Prepaid = (props) => {
  const { visible, setVisible, setPrepaid } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [value, setValue] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [searching, setSearching] = useState(false);

  const timer = useRef();

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
  }, [searching, value]);

  const onSearch = async () => {
    try {
      if (!value || value.length < 2) return;
      setLoading(true);
      const { data } = await dispatch(
        call({ url: `books/find`, method: "POST", data: { phone: value } })
      );
      setLoading(false);
      setCompleted(true);
      setData(data);
    } catch (e) {
      setLoading(false);
      setCompleted(false);
      setData([]);
    }
  };

  useEffect(() => {
    if (!visible) {
      setValue(null);
      setLoading(false);
      setCompleted(false);
      setData([]);
    }
  }, [visible]);

  const dispatch = useDispatch();
  const onSelect = (item) => () => {
    setPrepaid(item);
    setVisible(false);
  };

  return (
    <>
      <Modal
        title="Указать предоплату"
        open={visible}
        zIndex={1001}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <MaskedInput
          mask="+7 000 000 00 00"
          style={{ width: "100%" }}
          value={value}
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
            select
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`Предоплата - ${item.prepay}₸`}
                />
                <Button type="link" onClick={onSelect(item)}>
                  Выбрать
                </Button>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
};

export default Prepaid;
