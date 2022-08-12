import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "createdAt",
      title: "Дата",
    },
    {
      dataIndex: "type",
      title: "Тип",
    },
    {
      dataIndex: "price",
      title: "Сумма",
    },
    {
      dataIndex: "total",
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
