import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Название",
      dataIndex: "name",
    },
    {
      title: "Стоимость часа",
      dataIndex: "hour",
    },
    {
      title: "Минимум",
      dataIndex: "min",
    },
    {
      title: "Максимум",
      dataIndex: "max",
    },
    {
      title: "Округление",
      dataIndex: "round",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
