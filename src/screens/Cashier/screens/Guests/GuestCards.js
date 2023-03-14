import React, { useEffect, useState } from "react";
import { Card, Empty } from "antd";
import { Loading } from "@/ui";
import { call } from "@/actions/axios";
import { SET_APP } from "@/actions/app";
import dayjs from "dayjs";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

const GuestCards = (props) => {
  const { onSelect } = props;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const current_shift = useSelector((state) => state.app.current_shift);
  const guests = useSelector((state) => state.app.guests || []);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const values = { shift: current_shift._id };

        const query = queryString.stringify(values);

        const { data } = await dispatch(call({ url: `guests?${query}` }));
        dispatch(SET_APP(["guests"], data));
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading && guests.length === 0) return <Loading />;
  else if (guests.length === 0) return <Empty description="Нет гостей" />;

  const gridStyle = {
    width: "25%",
    textAlign: "center",
  };

  return (
    <Card className="room" bordered={false}>
      {_.filter(guests, { assigned: false }).map((guest) => {
        const { table, createdAt, name } = guest;
        const time = dayjs(createdAt).format("HH:mm");
        return (
          <Card.Grid
            key={createdAt}
            className="table"
            style={{ ...gridStyle, backgroundColor: table.color }}
            onClick={onSelect(guest)}
          >
            {`#${table.number}`}
            <br />
            {`${name}`}
            <br />
            {time}
          </Card.Grid>
        );
      })}
    </Card>
  );
};

export default GuestCards;
