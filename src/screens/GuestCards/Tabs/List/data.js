import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "number",
      title: "Карта",
    },
    {
      dataIndex: "name",
      title: "Имя",
    },
    {
      dataIndex: "balance",
      title: "Баланс",
    },
    {
      dataIndex: "phone",
      title: "Контакты",
    },
    {
      dataIndex: "birthdate",
      title: "Дата рождения",
    },
    {
      dataIndex: "first_visit",
      title: "Первый визит",
    },
    {
      dataIndex: "last_visit",
      title: "Последний визит",
    },
    {
      dataIndex: "sum",
      title: "Сумма",
    },
    {
      dataIndex: "description",
      title: "Комментарий",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
