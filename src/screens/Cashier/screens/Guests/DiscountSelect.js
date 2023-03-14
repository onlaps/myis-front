import React from "react";
import { Modal, Button, Table, List } from "antd";
import { discount_columns, discountSource } from "./data";
import { call } from "@/actions/axios";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

const DiscountSelect = (props) => {
  const { visible, setVisible, onSelect, selected } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [active, setActive] = useState(null);

  const current_place = useSelector((state) => state.app.current_place);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        console.log("hey");
        setLoading(true);
        const values = { type: ["1", "2", "3", "4"] };
        values.place = current_place._id;
        const query = queryString.stringify(values);
        const { data } = await dispatch(call({ url: `discounts?${query}` }));
        setLoading(false);
        setData(data);
      } catch (e) {
        setLoading(false);
      }
    };
    if (visible) {
      getData();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (visible) {
      if (selected) setDiscount(selected);
    } else {
      setDiscount(null);
    }
  }, [visible, selected]);

  const onOk = () => {
    onSelect(discount);
    setVisible(false);
  };

  const onOpen = (item) => () => {
    setActive(item);
  };

  const options = {
    discount: {
      render: (val) => `${val}%`,
    },
    condition: {
      render: (val, item) => {
        return (
          <Button type="link" onClick={onOpen(item)}>
            Посмотреть
          </Button>
        );
      },
    },
  };

  return (
    <>
      <Modal
        open={visible}
        title="Выберите скидку"
        onOk={onOk}
        onCancel={() => setVisible(false)}
        width="50%"
        zIndex={1000}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
        destroyOnClose={true}
      >
        <Table
          rowSelection={{
            type: "radio",
            onChange: (selectedRowKey, selectedRow) => {
              setDiscount(selectedRow[0]);
            },
            selectedRowKeys: discount ? [discount._id] : [],
            getCheckboxProps: (record) => ({
              name: record.name,
            }),
          }}
          rowKey="_id"
          columns={discount_columns(options)}
          dataSource={data}
          loading={loading}
        />
      </Modal>
      <Modal
        title={active?.name}
        open={!!active}
        zIndex={1001}
        onCancel={() => setActive(null)}
        footer={null}
        width="50%"
      >
        <List
          itemLayout="horizontal"
          dataSource={discountSource(active)}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              <div>{item.value && item.value}</div>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default DiscountSelect;
