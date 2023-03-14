import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "createdAt",
      title: "Дата",
    },
    {
      dataIndex: "time",
      title: "Время",
    },
    {
      dataIndex: "type",
      title: "Тип",
    },
    {
      dataIndex: "sum",
      title: "Сумма",
    },
    {
      dataIndex: "description",
      title: "Комментарий",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
