import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { call } from "@/actions/axios";
import { SET_APP, PUSH_APP, REMOVE_APP_BY_VALUE } from "@/actions/app";
import { Card, Row, Col, Checkbox, Radio, Empty } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import dayjs from "dayjs";
import _ from "lodash";

const Checklists = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  const checklists_start = useSelector(
    (state) => state.app.checklists_start || []
  );
  const checklists_start_values = useSelector(
    (state) => state.app.checklists_start_values || []
  );
  const current_place = useSelector((state) => state.app.current_place);
  const current_shift = useSelector((state) => state.app.current_shift);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      setLoading(true);
      const query = queryString.stringify({
        place: current_place._id,
        type: "1",
      });
      const { data } = await dispatch(call({ url: `checklists?${query}` }));

      const groupped = {};

      data.forEach((item) => {
        const cid = item.checklist_category._id;
        if (!_.isArray(groupped[cid])) {
          groupped[cid] = [];
          groupped[cid].push(item);
        } else {
          groupped[cid].push(item);
        }
      });

      dispatch(SET_APP(["checklists_start"], groupped));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getValues = async () => {
    const query = queryString.stringify({
      shift: current_shift._id,
      type: "start",
    });
    const { data } = await dispatch(call({ url: `checklists/check?${query}` }));

    dispatch(
      SET_APP(
        ["checklists_start_values"],
        data.map((v) => v.checklist)
      )
    );
  };

  useEffect(() => {
    getData();
    getValues();
  }, []); //eslint-disable-line

  const dow = dayjs().day();
  const day = dow === 0 ? 7 : dow;
  const date = dayjs().date();

  const renderEmpty = () => (
    <Col span={24}>
      <Card>
        <Empty />
      </Card>
    </Col>
  );

  const renderChecklists = () => {
    if (Object.keys(checklists_start).length === 0) return renderEmpty();

    return Object.keys(checklists_start).map((key) => {
      const items = checklists_start[key];
      const title = items[0].checklist_category.name;

      const data = _.filter(items, (o) => {
        let days_of_week = true;
        let days_of_month = true;
        let only_type = true;
        if (o.days_of_week.length > 0) {
          days_of_week = o.days_of_week.indexOf(day) !== -1;
        }
        if (o.days_of_month.length > 0) {
          days_of_month = o.days_of_month.indexOf(date) !== -1;
        }
        if (o.only_type) {
          only_type = o.only_type && value === 0;
        }
        return (days_of_week || days_of_month) && only_type;
      });

      if (data.length === 0) return renderEmpty();

      return (
        <Col span={12} key={key}>
          <Card title={title}>
            <Checkbox.Group value={checklists_start_values}>
              {data.map((v) => (
                <div key={v._id}>
                  <Checkbox disabled={loading} value={v._id} onChange={onCheck}>
                    {v.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Card>
        </Col>
      );
    });
  };
  const options = [
    { label: "Первая смена", value: 0 },
    { label: "Не первая смена", value: 1 },
  ];

  const onCheck = (e) => {
    dispatch(
      call({
        url: `checklists/check`,
        data: {
          checklist: e.target.value,
          shift: current_shift._id,
          checked: e.target.checked,
          type: "start",
        },
        method: "POST",
      })
    );
    if (e.target.checked) {
      dispatch(PUSH_APP(["checklists_start_values"], e.target.value));
    } else {
      console.log(_.filter(checklists_start_values, e.target.value));
      dispatch(
        REMOVE_APP_BY_VALUE(["checklists_start_values"], e.target.value)
      );
    }
  };

  const onChange = async (e) => {
    setValue(e.target.value);

    await dispatch(
      call({
        url: `shifts/${current_shift._id}`,
        data: { start: e.target.value === 0 },
        method: "PATCH",
      })
    );
  };

  const getSlider = () => {
    return (
      <Radio.Group
        options={options}
        onChange={onChange}
        value={value}
        optionType="button"
        buttonStyle="solid"
      />
    );
  };

  return (
    <>
      <Col span={18}>
        <PageHeader extra={getSlider()} style={{ marginBottom: 10 }} />
        <Row gutter={[20, 20]}>{renderChecklists()}</Row>
      </Col>
    </>
  );
};

export default Checklists;
