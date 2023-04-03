import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Наименование",
    },
    {
      dataIndex: "used",
      title: "Кол-во применений",
    },
    {
      dataIndex: "discount_item_service_sum",
      title: "Сумма скидки за заказы",
    },
    {
      dataIndex: "discount_hours_sum",
      title: "Сумма скидки на время",
    },
    {
      dataIndex: "total",
      title: "Общее",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
