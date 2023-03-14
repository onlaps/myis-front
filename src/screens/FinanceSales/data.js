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
      dataIndex: "discount",
      title: "Скидка",
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
  ];

  return advancedColumns(options, filters, sorter)(data);
};
