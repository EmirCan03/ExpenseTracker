import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Gösterge Paneli",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Gelir",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Gider",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "06",
    label: "Çıkış",
    icon: LuLogOut,
    path: "logout",
  },
];