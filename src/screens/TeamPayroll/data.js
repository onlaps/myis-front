import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Сотрудник",
    },
    {
      dataIndex: "shifts",
      title: "Смен",
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
      dataIndex: "menu_items",
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
      dataIndex: "fixed_salary",
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

export const bonus_types = [
  {
    value: "bonus",
    text: "Бонус",
  },
  {
    value: "penalty",
    text: "Штраф",
  },
];

export const historyColumns = (options) => {
  const data = [
    { dataIndex: "createdAt", title: "Дата создания" },
    { dataIndex: "type", title: "Тип" },
    { dataIndex: "date", title: "Период" },
    { dataIndex: "value", title: "Размер" },
    { dataIndex: "description", title: "Описание" },
    { dataIndex: "actions" },
  ];
  return advancedColumns(options)(data);
};
