import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "total_time",
      title: "Общее время использования, мин",
    },
    {
      dataIndex: "total_sum",
      title: "Общая оплата по тарифу",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
