import { advancedColumns } from "@/utils";
import {
  types,
  discount_types,
  menu_types,
} from "@/screens/GuestsDiscounts/Tabs/Discounts/data";
import _ from "lodash";
import dayjs from "dayjs";

export const columns = (options, filters, sorter) => {
  const data = [
    {
      dataIndex: "name",
      title: "Клиент",
    },
    {
      title: "Время",
      dataIndex: "time",
    },
    {
      title: "Время, ₸",
      dataIndex: "timemoney",
    },
    {
      title: "Товары",
      dataIndex: "items",
    },
    {
      title: "Товары, ₸",
      dataIndex: "itemsmoney",
    },
    {
      title: "Итого, ₸",
      dataIndex: "total",
    },
  ];

  return advancedColumns(options, filters, sorter)(data);
};

export const discount_columns = (options) => {
  const data = [
    {
      dataIndex: "name",
      title: "Название",
    },
    {
      dataIndex: "discount",
      title: "Размер скидки",
    },
    {
      dataIndex: "condition",
      title: "Условия",
    },
  ];

  return advancedColumns(options)(data);
};

export const discountSource = (active) => {
  if (!active) return [];

  const find = (arr, val) => {
    if (!val) return null;
    const item = _.find(arr, { value: val });
    if (!item) return null;

    return item?.name;
  };

  const dateRender = (active) => {
    const days = dayjs.weekdaysMin(true);
    const data = [];
    if (!_.isEmpty(active.days)) {
      data.push(active.days.map((v) => days[v - 1]).join(", "));
    }
    if (active.time_from && active.time_to) {
      data.push(`(${active.time_from}-${active.time_to})`);
    }

    return data.join(" ");
  };

  const data = [
    { title: "Скидка", value: `${active.discount}%` },
    {
      title: "Тип активации",
      value: find(types, active.type),
    },
  ];

  data.push({
    title: "Скидка распространяется",
    value: find(discount_types, active.discount_type),
  });

  const by_menu = {
    title: "Ограничения по меню",
    value: find(menu_types, active.menu_type),
  };

  const by_time = {
    title: "Ограничения по времени",
    value: dateRender(active),
  };

  if (active.discount_type === "1") {
    data.push(by_menu);
    data.push(by_time);
  } else if (active.discount_type === "2") {
    data.push(by_time);
  } else if (active.discount_type === "3") {
    data.push(by_menu);
  }

  if (
    (active.discount_type === "1" || active.discount_type === "3") &&
    active.menu_type === "2"
  ) {
    data.push({
      title: "Категории",
      value: active.menu_categories.map((v) => v.name).join(", "),
    });
  }

  data.push({ title: "Минимальная сумма чека", value: active.min });
  data.push({
    title: "Описание",
    value: active.description,
  });

  return data;
};
