import { advancedColumns } from "@/utils";

const abc = (index) => (v, item) => {
  let value = { l: "A", c: "#52bb56" };
  if (item[index] <= 5) value = { l: "C", c: "#ef5350" };
  else if (item[index] <= 15) value = { l: "B", c: "#f1b53d" };

  return {
    props: {
      style: { backgroundColor: value.c, textAlign: "center" },
    },
    children: value.l,
  };
};

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "profit",
      title: "Прибыль",
    },
    {
      dataIndex: "profitPercentage",
      title: "Прибыль, %",
      render: (v) => `${v}%`,
    },
    {
      dataIndex: "totalRevenue",
      title: "Выручка",
    },
    {
      dataIndex: "revenuePercentage",
      title: "Выручка, %",
      render: (v) => `${v}%`,
    },
    {
      dataIndex: "totalCount",
      title: "Количество",
    },
    {
      dataIndex: "countPercentage",
      title: "Количество, %",
      render: (v) => `${v}%`,
    },
    {
      dataIndex: "profit_abc",
      title: "Прибыль",
      render: abc("profitPercentage", "l"),
    },
    {
      dataIndex: "revenue_abc",
      title: "Выручка",
      render: abc("revenuePercentage", "l"),
    },
    {
      dataIndex: "count_abc",
      title: "Количество,",
      render: abc("countPercentage", "l"),
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
