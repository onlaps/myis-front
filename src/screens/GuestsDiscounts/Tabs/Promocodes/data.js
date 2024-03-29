import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Дата создания",
      dataIndex: "createdAt",
    },
    {
      dataIndex: ["user", "name"],
      title: "Автор",
    },
    {
      dataIndex: ["discount", "name"],
      title: "Скидка",
    },
    {
      dataIndex: "code",
      title: "Код",
    },
    {
      dataIndex: "due_to",
      title: "Актуален до",
    },
    {
      dataIndex: "used",
      title: "Использовано",
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
