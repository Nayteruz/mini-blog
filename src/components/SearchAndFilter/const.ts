import { SORT_TYPE } from "@/contants";

export const SORT_OPTIONS = [
  {
    id: SORT_TYPE.NEVEST,
    value: SORT_TYPE.NEVEST,
    name: "Сначала новые",
  },
  {
    id: SORT_TYPE.OLDEST,
    value: SORT_TYPE.OLDEST,
    name: "Сначала старые",
  },
  {
    id: SORT_TYPE.TITLE,
    value: SORT_TYPE.TITLE,
    name: "По заголовку (А-Я)",
  },
];
