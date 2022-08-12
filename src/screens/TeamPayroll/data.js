import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "user",
      title: "Сотрудник",
    },
    {
      dataIndex: "shifts",
      title: "Остаток",
    },
    {
      dataIndex: "hours",
      title: "Часов",
    },
    {
      dataIndex: "guests",
      title: "Гости",
    },
    {
      dataIndex: "items",
      title: "Товары",
    },
    {
      dataIndex: "services",
      title: "Услуги",
    },
    {
      dataIndex: "prepaid",
      title: "Аванс",
    },
    {
      dataIndex: "fix",
      title: "Фикс",
    },
    {
      dataIndex: "percent",
      title: "Процент",
    },
    {
      dataIndex: "bonus",
      title: "Бонусы",
    },
    {
      dataIndex: "penalty",
      title: "Штрафы",
    },
    {
      dataIndex: "total",
      title: "Итого",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const test = [
  {
    key: "1",
    type: "penalty",
    date: "2022-07-10",
    value: "4500",
    description: "Премя за хорошее поведение",
  },
  {
    key: "2",
    type: "bonus",
    date: "2022-07-10",
    value: "-3000",
    description: "Плохое поведение",
  },
];

export const historyColumns = (options) => {
  const data = [
    { dataIndex: "type" },
    { dataIndex: "date" },
    { dataIndex: "value" },
    { dataIndex: "description" },
    { dataIndex: "actions" },
  ];
  return advancedColumns(options)(data);
};
