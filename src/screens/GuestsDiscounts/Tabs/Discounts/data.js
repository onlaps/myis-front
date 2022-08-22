import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Наименование",
    },
    {
      dataIndex: "discount",
      title: "Скидка",
    },
    {
      dataIndex: "type",
      title: "Тип активации",
    },
    {
      dataIndex: "restriction",
      title: "Ограничения",
    },
    {
      dataIndex: "places",
      title: "Торговые точки",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
