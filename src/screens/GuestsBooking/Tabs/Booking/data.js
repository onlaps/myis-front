import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "time",
      title: "Время",
    },
    {
      dataIndex: "guests",
      title: "Гостей",
    },
    {
      dataIndex: "client",
      title: "Контакты",
    },
    {
      dataIndex: "tables",
      title: "Столы/Места",
    },
    {
      dataIndex: "description",
      title: "Комментарий",
    },
    {
      dataIndex: "created_at",
      title: "Дата создания",
    },
    {
      dataIndex: "actions",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
