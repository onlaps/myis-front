import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Торговая точка",
      dataIndex: "place",
    },
    {
      title: "Количество",
      dataIndex: "total",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
