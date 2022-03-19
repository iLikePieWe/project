import {
  AssignmentRounded,
  ChatRounded,
  HomeRounded,
  PublicRounded,
} from "@mui/icons-material";
const sidebarItems = [
  {
    icon: <PublicRounded />,
    text: "Чат",
    route: "/global",
  },
  {
    icon: <AssignmentRounded />,
    text: "Задачи",
    route: "/problems",
  },
];

export default sidebarItems;
