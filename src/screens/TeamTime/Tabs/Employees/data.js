import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "user",
      title: "Сотрудник",
      width: 200,
    },
    ...new Array(7).fill(1).map((_, i) => ({ dataIndex: i.toString() })),
  ];

  return advancedColumns(options, filters, sorter)(data);
};
