import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "Сотрудник",
      dataIndex: "user",
    },
    {
      title: "Время",
      dataIndex: "date",
    },
    {
      title: "Выручка",
      dataIndex: "cash_receiptes",
    },
    {
      title: "На начало",
      dataIndex: "start_sum",
    },
    {
      title: "Расходы",
      dataIndex: "expenses",
    },
    {
      title: "Изъятия",
      dataIndex: "withdrawal",
    },
    {
      title: "Пополнения",
      dataIndex: "deposit",
    },
    {
      title: "На конец",
      dataIndex: "balance",
    },
    {
      title: "Выручка, карта",
      dataIndex: "card_receiptes",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
