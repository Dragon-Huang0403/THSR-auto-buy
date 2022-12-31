import type { SearchType, Stations, StationValue } from "./THSRTimeTable";

export const stations: Stations = [
  ["NanGang", "南港"],
  ["TaiPei", "台北"],
  ["BanQiao", "板橋"],
  ["TaoYuan", "桃園"],
  ["XinZhu", "新竹"],
  ["MiaoLi", "苗栗"],
  ["TaiZhong", "台中"],
  ["ZhangHua", "彰化"],
  ["YunLin", "雲林"],
  ["JiaYi", "嘉義"],
  ["TaiNan", "台南"],
  ["ZuoYing", "左營"],
];

export const stationValues = stations.map((station) => station[0]) as [
  StationValue,
  ...StationValue[]
];

export const searchTypes: Array<[SearchType, string]> = [
  ["S", "單程"],
  ["R", "去回程"],
];
