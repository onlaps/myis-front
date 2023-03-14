import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "duration",
      title: "Общее время использования, мин",
    },
    {
      dataIndex: "sum",
      title: "Общая оплата по тарифу",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
