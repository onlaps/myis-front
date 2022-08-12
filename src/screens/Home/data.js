export const columns = [
  {
    key: "place",
    dataIndex: "place",
    title: "Товарная точка",
  },
  {
    title: "Сегодня",
    children: [
      {
        key: "sum",
        dataIndex: "sum",
        title: "Выручка",
      },
      {
        key: "guests",
        dataIndex: "guests",
        title: "Гости",
      },
    ],
  },
  {
    title: "За месяц",
    children: [
      {
        key: "sum",
        dataIndex: "sum",
        title: "Выручка",
      },
      {
        key: "avg",
        dataIndex: "avg",
        title: "Средний чек",
      },
      {
        key: "costs",
        dataIndex: "costs",
        title: "Расходы",
      },
      {
        key: "revenue",
        dataIndex: "revenue",
        title: "Прибыль",
      },
    ],
  },
];
