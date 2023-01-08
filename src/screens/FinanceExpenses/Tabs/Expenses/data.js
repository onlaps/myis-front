import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Сотрудник",
      dataIndex: "user",
    },
    {
      title: "Дата",
      dataIndex: "date",
    },
    {
      title: "Время",
      dataIndex: "time",
    },
    {
      title: "Позиции",
      dataIndex: "items",
    },
    {
      title: "Сумма",
      dataIndex: "total",
    },
    {
      title: "Комментарий",
      dataIndex: "description",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const types = [
  { name: "Оплата наличными", value: "1" },
  { name: "Безналичная оплата", value: "2" },
];
