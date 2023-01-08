import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "value",
      title: "Значение",
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
  { name: "Вес", value: "1", unit: "гр" },
  { name: "Объем", value: "2", unit: "мл" },
  { name: "Количество", value: "3", unit: "шт" },
];
