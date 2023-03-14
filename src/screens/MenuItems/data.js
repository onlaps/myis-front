import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "cost_price",
      title: "Себестоимость, ₸",
    },
    {
      dataIndex: "item_price",
      title: "Цена, ₸",
    },
    {
      dataIndex: "margin",
      title: "Наценка, ₸",
    },
    {
      dataIndex: "margin_percent",
      title: "Маржинальность",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
