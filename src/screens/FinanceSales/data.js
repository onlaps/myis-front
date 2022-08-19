import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "period",
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
      dataIndex: "sum",
      title: "Скидки",
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
      title: "Кассир",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
