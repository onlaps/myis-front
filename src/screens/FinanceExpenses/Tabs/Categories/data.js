import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "type",
      title: "Тип",
    },
    {
      dataIndex: "available_in_shift",
      title: "Доступно в смене",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
