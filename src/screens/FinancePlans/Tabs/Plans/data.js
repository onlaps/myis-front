import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Название",
      dataIndex: "name",
    },
    {
      title: "Торговые точки",
      dataIndex: "places",
    },
    {
      title: "С первого часа",
      dataIndex: "first_hour",
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
      title: "Дни",
      dataIndex: "days",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
