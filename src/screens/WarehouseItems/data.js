import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "left",
      title: "Остаток",
    },
    {
      dataIndex: "price",
      title: "Цена",
    },
    {
      dataIndex: "total",
      title: "Стоимость",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const historyColumns = [
  {
    dataIndex: "type",
  },
  {
    dataIndex: "createdAt",
  },
  {
    dataIndex: "value",
  },
  {
    dataIndex: "price",
  },
];
