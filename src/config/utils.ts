import { grey, green, blue, red, orange } from "@ant-design/colors";

export const SKILLS_LIST = [
  { label: "React.JS", value: "REACT.JS" },
  { label: "React Native", value: "REACT NATIVE" },
  { label: "Vue.JS", value: "VUE.JS" },
  { label: "Angular", value: "ANGULAR" },
  { label: "Nest.JS", value: "NEST.JS" },
  { label: "TypeScript", value: "TYPESCRIPT" },
  { label: "Java", value: "JAVA" },
  { label: "Frontend", value: "FRONTEND" },
  { label: "Backend", value: "BACKEND" },
  { label: "Fullstack", value: "FULLSTACK" },
];

export const LOCATION_LIST = [
  { label: "Hà Nội", value: "HANOI" },
  { label: "Hồ Chí Minh", value: "HOCHIMINH" },
  { label: "Đà Nẵng", value: "DANANG" },
  { label: "Others", value: "OTHER" },
  { label: "Tất cả thành phố", value: "ALL" },
];

export const LEVEL_LIST = [
  { label: "Intern", value: "INTERN" },
  { label: "Fresher", value: "FRESHER" },
  { label: "Junior", value: "JUNIOR" },
  { label: "Middle", value: "MIDDLE" },
  { label: "Senior", value: "SENIOR" },
];

export function colorMethod(
  method: "POST" | "PUT" | "GET" | "DELETE" | string
) {
  switch (method) {
    case "POST":
      return green[6];
    case "PUT":
      return orange[6];
    case "GET":
      return blue[6];
    case "DELETE":
      return red[6];
    default:
      return grey[10];
  }
}
