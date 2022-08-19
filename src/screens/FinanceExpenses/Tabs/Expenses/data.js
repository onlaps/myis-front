import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Сотрудник",
      dataIndex: "employee",
    },
    {
      title: "Дата",
      dataIndex: "date",
    },
    {
      title: "Время",
      dataIndex: "time",
    },
    {
      title: "Документ",
      dataIndex: "summ",
    },
    {
      title: "Позиции",
      dataIndex: "position",
    },
    {
      title: "Сумма",
      dataIndex: "summ",
    },
    {
      title: "Комментарий",
      dataIndex: "description",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
