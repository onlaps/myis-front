import { Form } from "antd";
import React, { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_APP } from "@/actions/app";
import _ from "lodash";
import dayjs from "dayjs";

const Filters = forwardRef((props, ref) => {
  const { onFinish, children } = props;

  const dispatch = useDispatch();
  const places = useSelector((state) => state.app.places || []);
  const place = useSelector((state) => state.app.place);
  const period = useSelector((state) => state.app.period);
  const date = useSelector((state) => state.app.date);

  useEffect(() => {
    if (places.length > 0 && !place) {
      dispatch(SET_APP(["place"], places[0]._id));
    }
  }, [places, place]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const current_date = dayjs().format("YYYY-MM-DD");
    if (!date) {
      dispatch(SET_APP(["date"], current_date));
    }
    if (!period || period.length === 0) {
      dispatch(SET_APP(["period"], [current_date, current_date]));
    }
  }, []);

  useEffect(() => {
    const values = {};
    if (place) {
      values.place = place;
    }
    if (period) {
      const [start_at, end_at] = period;
      values.period = [dayjs(start_at), dayjs(end_at)];
    }
    if (date) {
      values.date = dayjs(date);
    }

    if (!_.isEmpty(values)) {
      ref.current.setFieldsValue(values);
    }
  }, [place, period, date]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFieldsChange = (values) => {
    const [field] = values;
    if (!field) return;
    const [name] = field.name;
    const { value } = field;

    if (name === "place") {
      dispatch(SET_APP(["place"], value));
    } else if (name === "date") {
      const _date = value.format("YYYY-MM-DD");
      if (date !== _date) {
        dispatch(SET_APP(["date"], _date));
      }
    } else if (name === "period") {
      const [start_at, end_at] = value;
      dispatch(
        SET_APP(
          ["period"],
          [start_at.format("YYYY-MM-DD"), end_at.format("YYYY-MM-DD")]
        )
      );
    }
  };

  return (
    <Form
      style={{ marginBottom: 16 }}
      ref={ref}
      layout="inline"
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
    >
      {children}
    </Form>
  );
});

export default Filters;
