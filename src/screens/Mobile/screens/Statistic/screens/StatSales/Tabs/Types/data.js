import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "date",
      title: "Дата",
    },
    {
      dataIndex: "cash",
      title: "Наличными",
    },
    {
      dataIndex: "card",
      title: "Картой",
    },
    {
      dataIndex: "total",
      title: "Всего",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
