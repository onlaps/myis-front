import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Клиент",
    },
    {
      dataIndex: "table",
      title: "Столик",
    },
    {
      dataIndex: "tariff",
      title: "Тариф",
    },
    {
      title: "Время",
      dataIndex: "time",
    },
    {
      title: "Время, ₸",
      dataIndex: "timemoney",
    },
    {
      title: "Товары",
      dataIndex: "items",
    },
    {
      title: "Товары, ₸",
      dataIndex: "itemsmoney",
    },
    {
      title: "Итого, ₸",
      dataIndex: "total",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
