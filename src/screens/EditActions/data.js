import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "createdAt",
      title: "Дата",
    },
    {
      dataIndex: "place",
      title: "Торговая точка",
    },
    {
      dataIndex: "user",
      title: "Пользователь",
    },
    {
      dataIndex: "type",
      title: "Действие",
    },
    {
      dataIndex: "description",
      title: "Детально",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
