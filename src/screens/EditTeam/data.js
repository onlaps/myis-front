import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "login",
      title: "Пользователь",
    },
    {
      dataIndex: ["role", "name"],
      title: "Роль",
    },
    {
      dataIndex: "name",
      title: "ФИО",
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      dataIndex: "status",
      title: "Активен",
    },
    {
      dataIndex: "description",
      title: "Комментарий",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
