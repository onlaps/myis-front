import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { columns } from "./data";
import moment from "moment";
import _ from "lodash";

const Comp = () => {
  const [dates, setDates] = useState({});
  const [filters, setFilters] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    let fromDate = moment().startOf("week");
    let toDate = moment().endOf("week");
    let days = toDate.diff(fromDate, "days");
    let dates = [];
    for (let i = 0; i <= days; i++) {
      const day = moment(fromDate).add(i, "days");
      const date = day.format("YYYY-MM-DD");
      dates.push({
        title: day.format("DD.MM dd").toUpperCase(),
        date,
      });
    }
    setDates(dates);
  }, []);

  const days = () => {
    const days = {};
    if (_.isEmpty(dates)) return {};
    dates.forEach((d, i) => (days[i] = d));
    return days;
  };

  const onChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter({ [sorter.field]: sorter.order });
  };

  const options = {
    actions: {
      render: (_, item) => {
        return <div className="actions">123</div>;
      },
    },
    ...days(),
  };

  return (
    <>
      <Table
        columns={columns(options, filters, sorter)}
        pagination={pagination}
        onChange={onChange}
      />
    </>
  );
};

export default Comp;
