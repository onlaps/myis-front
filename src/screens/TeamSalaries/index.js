import React, { createContext, useState } from "react";
import { Layout, Button, PageHeader, Table } from "antd";
import { columns } from "./data";
import Create from "./Create";

export const Context = createContext();
const { Content } = Layout;

const Screen = (props) => {
  const [adding, setAdding] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
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
      <Context.Provider value={{ adding, setAdding }}>
        <Create />
        <Layout>
          <PageHeader
            title="Ставки по зарплате"
            ghost={false}
            extra={[
              <Button
                key="create"
                type="primary"
                onClick={() => setAdding(true)}
              >
                Создать
              </Button>,
            ]}
          />
          <Content className="main__content__layout">
            <Table
              columns={columns(options, filters, sorter)}
              onChange={onChange}
              pagination={pagination}
            />
          </Content>
        </Layout>
      </Context.Provider>
    </>
  );
};

export default Screen;
