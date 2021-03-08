import getIconPaths from "@utils/iconDetails";

const links = [
  {
    label: "About",
    to: "/about",
    iconData: getIconPaths("info"),
  },
  {
    label: "Colleges",
    to: "/colleges",
    iconData: getIconPaths("library"),
  },
  {
    label: "Team",
    to: "/team",
    iconData: getIconPaths("users"),
  },
];

export default links;
