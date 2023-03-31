import { advancedColumns } from "@/utils";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "date",
      title: "Месяц",
    },
    {
      dataIndex: "salaries",
      title: "Ставки",
    },
    {
      dataIndex: "places",
      title: "Торговые точки",
    },
    {
      dataIndex: "shift_plan",
      title: "Смена, план",
    },
    {
      dataIndex: "shift_bonus",
      title: "Смена, премия",
    },
    // {
    //   dataIndex: "user_plan",
    //   title: "Сотрудник за месяц, план",
    // },
    // {
    //   dataIndex: "user_bonus",
    //   title: "Сотрудник за месяц, премия",
    // },
    {
      dataIndex: "place_plan",
      title: "Заведение за месяц, план",
    },
    {
      dataIndex: "place_bonus",
      title: "Заведение за месяц, премия",
    },
    {
      dataIndex: "place_goal",
      title: "Смена, план",
    },
    {
      dataIndex: "place_goal_bonus",
      title: "Смена, бонус",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      width: 180,
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};
