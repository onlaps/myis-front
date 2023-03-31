import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "date",
      title: "Дата",
    },
    {
      dataIndex: "total",
      title: "Гостей",
    },
    {
      dataIndex: "hours_sum",
      title: "Выручка",
    },
    {
      dataIndex: "total_card",
      title: "С картой гостей",
    },
    {
      dataIndex: "avg",
      title: "Средний чек",
    },
    {
      dataIndex: "total_new",
      title: "Новые гости",
    },
    {
      dataIndex: "avg_hours",
      title: "Среднее время",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
