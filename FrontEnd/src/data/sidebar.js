import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";

const menu = [
  {
    title: "داشبرد",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "اضافه کردن محصولات",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "حساب کاربری",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "پروفایل",
        path: "/profile",
      },
      {
        title: "ویرایش پروفایل",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "گزارش خطا",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
