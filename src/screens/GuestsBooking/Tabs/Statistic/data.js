import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Дата",
      dataIndex: "date",
    },
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
      dataIndex: "rooms",
      title: "Столики/Места",
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
