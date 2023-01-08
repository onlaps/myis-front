import { HomeOutlined } from "@ant-design/icons";
import { ContactsOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { CoffeeOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";

const data = [
  {
    icon: <HomeOutlined />,
    title: "На главную",
    path: "/",
  },
  {
    icon: <ContactsOutlined />,
    title: "Открыть смену",
    path: "/cashier/shift",
  },
  {
    icon: <UsergroupAddOutlined />,
    title: "Новый гость",
    path: "/cashier/new",
  },
  {
    icon: <CoffeeOutlined />,
    title: "Продажа",
    path: "/cashier/order",
  },
  {
    icon: <UserOutlined />,
    title: "Гости",
    path: "/cashier/guests",
  },
  {
    icon: <BookOutlined />,
    title: "Бронирование",
    path: "/cashier/booking",
  },
];

export default data;
