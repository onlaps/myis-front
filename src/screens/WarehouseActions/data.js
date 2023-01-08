import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "date",
      title: "Дата",
    },
    {
      dataIndex: "action",
      title: "Тип движения",
    },
    {
      dataIndex: "total",
      title: "Сумма",
    },
    {
      dataIndex: "place",
      title: "Торговая точка",
    },
    {
      dataIndex: "items",
      title: "Позиции",
    },
    {
      dataIndex: "description",
      title: "Комментарий",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const types = [
  { name: "Оплата наличными", value: "1" },
  { name: "Безналичная оплата", value: "2" },
];
