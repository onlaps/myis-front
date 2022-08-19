import React, { useState } from "react";
import { Table } from "antd";
import { columns } from "./data";

const Comp = () => {
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [sorter, setSorter] = useState(null);

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
