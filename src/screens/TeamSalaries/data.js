import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "hourly",
      title: "Ставка за час",
    },
    {
      dataIndex: "shiftly",
      title: "Ставка за смену",
    },
    {
      dataIndex: "type",
      title: "Способ расчета",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const types = [
  { value: "0", text: "Без процента" },
  { value: "1", text: "От всей выручки" },
  { value: "2", text: "От всей выручки сверх плана" },
  {
    value: "3",
    text: "Отдельно выручки на блюда(тех карты) и товары на продажу сверх плана",
  },
];
