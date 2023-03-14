import React, { useContext, useState } from "react";
import { Modal, Table, Button, Popover } from "antd";
import { Context } from ".";
import { historyColumns, bonus_types } from "./data";
import { SET_APP_BY_PARAM } from "@/actions/app";
import _ from "lodash";
import dayjs from "dayjs";
import { call } from "@/actions/axios";
import classNames from "classnames";
import queryString from "query-string";
import "./index.less";
import { useDispatch, useSelector } from "react-redux";

const Comp = (props) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const { history, setHistory } = context;

  const place = useSelector((state) => state.app.place);
  const dispatch = useDispatch();

  const onDelete = (id) => async () => {
    try {
      setLoading(true);
      await dispatch(call({ url: `user_bonuses/${id}`, method: "DELETE" }));

      const query = queryString.stringify({ place });
      const { data } = await dispatch(
        call({ url: `users/salaries/count/${history._id}?${query}` })
      );

      dispatch(SET_APP_BY_PARAM(["user_payrolls"], ["_id", history._id], data));
      setHistory(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const options = {
    createdAt: {
      render: (val) => {
        return dayjs(val).format("DD.MM.YYYY");
      },
    },
    type: {
      render: (v) => {
        const type = _.find(bonus_types, { value: v });
        return <div className={classNames({ [v]: true })}>{type.text}</div>;
      },
    },
    date: {
      render: (v) => {
        return dayjs(v).format("MMM YYYY");
      },
    },
    description: {
      render: (val) => {
        if (!val) return null;

        return (
          <Popover content={val} trigger="hover" placement="bottom">
            <Button type="link">Показать</Button>
          </Popover>
        );
      },
    },
    actions: {
      render: (_, item) => {
        return (
          <Button
            disabled={loading}
            size="small"
            type="link"
            onClick={onDelete(item._id)}
          >
            Удалить
          </Button>
        );
      },
    },
  };

  return (
    <Modal
      open={!!history}
      okText="Сохранить"
      width="50%"
      footer={null}
      onCancel={() => !loading && setHistory(false)}
    >
      <Table
        dataSource={history?.bonuses || []}
        rowKey="_id"
        columns={historyColumns(options)}
        pagination={false}
      />
    </Modal>
  );
};

export default Comp;
