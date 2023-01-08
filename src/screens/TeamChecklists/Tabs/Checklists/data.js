import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Наименование",
    },
    {
      dataIndex: "type",
      title: "Тип",
    },
    {
      dataIndex: "days_of_week",
      title: "День недели",
    },
    {
      dataIndex: "days_of_month",
      title: "День месяца",
    },
    {
      dataIndex: "places",
      title: "Торговые точки",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const types = [
  { name: "В начале смены", value: "1" },
  { name: "В конце смены", value: "2" },
];
