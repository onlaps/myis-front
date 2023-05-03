import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "amount",
      title: "Остаток",
    },
    {
      dataIndex: "price",
      title: "Цена, ₸",
    },
    {
      dataIndex: "total",
      title: "Стоимость, ₸",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const historyColumns = (options, filters, sorter) => {
  const data = [
    {
      title: "Тип движения",
      dataIndex: "wh_action",
    },
    {
      title: "Дата",
      dataIndex: "createdAt",
    },
    {
      title: "Количество",
      dataIndex: "amount",
    },
    {
      title: "Цена, ₸",
      dataIndex: "price",
    },
  ];
  return advancedColumns(options, filters, sorter)(data);
};
