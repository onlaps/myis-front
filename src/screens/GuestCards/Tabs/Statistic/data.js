import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Торговая точка",
      dataIndex: "name",
    },
    {
      title: "Количество",
      dataIndex: "guests",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
