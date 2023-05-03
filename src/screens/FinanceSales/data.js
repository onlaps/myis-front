import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "time",
      title: "Время",
    },
    {
      dataIndex: "guest",
      title: "Гость",
    },
    {
      dataIndex: "positions",
      title: "Позиции",
    },
    {
      dataIndex: "type",
      title: "Тип оплаты",
    },
    {
      dataIndex: "sum",
      title: "Сумма",
    },
    {
      dataIndex: "user",
      title: "Пользователь",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
