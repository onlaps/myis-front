import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      key: "name",
      dataIndex: "name",
      title: "Товарная точка",
    },
    {
      title: "Сегодня",
      children: [
        {
          dataIndex: "revenue_today",
          title: "Выручка",
        },
        {
          dataIndex: "guests",
          title: "Гости",
          render: (v, item) => {
            return item.online_guests + item.offline_guests;
          },
        },
      ],
    },
    {
      title: "С начала месяца",
      children: [
        {
          dataIndex: "revenue_month",
          title: "Выручка",
        },
        {
          dataIndex: "total_guests_month",
          title: "Гостей",
        },
        {
          dataIndex: "avg_check",
          title: "Средний чек",
          render: (v) => {
            return Math.round(v);
          },
        },
        {
          dataIndex: "expenses_month",
          title: "Расходы",
        },
        {
          dataIndex: "profit_month",
          title: "Прибыль",
        },
      ],
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
