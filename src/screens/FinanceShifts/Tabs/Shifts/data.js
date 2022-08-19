import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      title: "",
      children: [
        {
          title: "Смена",
          dataIndex: "shift",
        },
        {
          title: "Сотрудник",
          dataIndex: "user",
        },
        {
          title: "Время",
          dataIndex: "period",
        },
      ],
    },
    {
      title: "Наличные",
      children: [
        {
          title: "Выручка",
          dataIndex: "revenue",
        },
        {
          title: "На начало",
          dataIndex: "at_start",
        },
        {
          title: "Расходы",
          dataIndex: "expenses",
        },
        {
          title: "Инкассация",
          dataIndex: "collection",
        },
        {
          title: "На конец",
          dataIndex: "at_end",
        },
        {
          title: "Остаток",
          dataIndex: "balance",
        },
      ],
    },

    {
      title: "По карте",
      children: [
        {
          title: "Выручка",
          dataIndex: "revenue",
        },
      ],
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
