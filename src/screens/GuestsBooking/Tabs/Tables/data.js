import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Наименование",
      dataIndex: "name",
    },
    {
      title: "Столы/Места",
      dataIndex: "tables",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
