import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Наименование",
    },
    {
      dataIndex: "discount",
      title: "Скидка",
    },
    {
      dataIndex: "type",
      title: "Тип активации",
    },
    {
      dataIndex: "discount_type",
      title: "Скидка распространяется",
    },
    {
      dataIndex: "places",
      title: "Торговые точки",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const types = [
  { name: "Выбор вручную", value: "1" },
  { name: "Автоматический", value: "2" },
  { name: "По карте гостя", value: "3" },
  { name: "По промокоду", value: "4" },
  { name: "Недоступно", value: "5" },
];

export const discount_types = [
  { name: "На время и на меню", value: "1" },
  { name: "Только на время", value: "2" },
  { name: "Только на меню", value: "3" },
];

export const menu_types = [
  { name: "Без ограничений", value: "1" },
  { name: "Только к выбранным категориям", value: "2" },
];

export const client_types = [
  { name: "Доступно всем", value: "1" },
  { name: "Доступно всем зарегистрированным клиентам", value: "2" },
  { name: "Доступно только новым клиентам", value: "3" },
];
