import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "createdAt",
      title: "Дата",
    },
    {
      dataIndex: "user",
      title: "Сотрудник",
    },
    {
      dataIndex: "amount",
      title: "Сумма",
    },
    {
      dataIndex: "description",
      title: "Комментарий",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
