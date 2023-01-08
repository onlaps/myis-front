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
      title: "Со второго часа",
      dataIndex: "second_hour",
    },
    {
      title: "С третьего часа",
      dataIndex: "third_hour",
    },
    {
      title: "Остальные часы",
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
