import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Наименование",
    },
    {
      dataIndex: "city",
      title: "Город",
    },
    {
      dataIndex: "address",
      title: "Адрес",
    },
    {
      dataIndex: "phone",
      title: "Телефон",
    },
    {
      dataIndex: "status",
      title: "Активен",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
