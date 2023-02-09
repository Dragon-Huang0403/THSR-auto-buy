export const searchTypes = {
  S: { name: '單程', value: 0 },
  R: { name: '去回程', value: 1 },
} as const;

const earlyBird = 'e1b4c4d9-98d7-4c8c-9834-e1d2528750f1';
const collegeStudent = '68d9fc7b-7330-44c2-962a-74bc47d2ee8a';
export const discountType = {
  earlyBird,
  collegeStudent,
  all: `${earlyBird},${collegeStudent}`,
} as const;

export const STATION_OBJECTS = {
  NanGang: { name: '南港', value: '1', id: '0990' },
  TaiPei: { name: '台北', value: '2', id: '1000' },
  BanQiao: { name: '板橋', value: '3', id: '1010' },
  TaoYuan: { name: '桃園', value: '4', id: '1020' },
  XinZhu: { name: '新竹', value: '5', id: '1030' },
  MiaoLi: { name: '苗栗', value: '6', id: '1035' },
  TaiZhong: { name: '台中', value: '7', id: '1040' },
  ZhangHua: { name: '彰化', value: '8', id: '1043' },
  YunLin: { name: '雲林', value: '9', id: '1047' },
  JiaYi: { name: '嘉義', value: '10', id: '1050' },
  TaiNan: { name: '台南', value: '11', id: '1060' },
  ZuoYing: { name: '左營', value: '12', id: '1070' },
} as const;

export const STATIONS = [
  'NanGang',
  'TaiPei',
  'BanQiao',
  'TaoYuan',
  'XinZhu',
  'MiaoLi',
  'TaiZhong',
  'ZhangHua',
  'YunLin',
  'JiaYi',
  'TaiNan',
  'ZuoYing',
] as const;

export const timeOptions = [
  {
    value: '1201A',
    time: [0, 0],
  },
  {
    value: '1230A',
    time: [0, 30],
  },
  {
    value: '600A',
    time: [6, 0],
  },
  {
    value: '630A',
    time: [6, 30],
  },
  {
    value: '700A',
    time: [7, 0],
  },
  {
    value: '730A',
    time: [7, 30],
  },
  {
    value: '800A',
    time: [8, 0],
  },
  {
    value: '830A',
    time: [8, 30],
  },
  {
    value: '900A',
    time: [9, 0],
  },
  {
    value: '930A',
    time: [9, 30],
  },
  {
    value: '1000A',
    time: [10, 0],
  },
  {
    value: '1030A',
    time: [10, 30],
  },
  {
    value: '1100A',
    time: [11, 0],
  },
  {
    value: '1130A',
    time: [11, 30],
  },
  {
    value: '1200N',
    time: [12, 0],
  },
  {
    value: '1230P',
    time: [12, 30],
  },
  {
    value: '100P',
    time: [13, 0],
  },
  {
    value: '130P',
    time: [13, 30],
  },
  {
    value: '200P',
    time: [14, 0],
  },
  {
    value: '230P',
    time: [14, 30],
  },
  {
    value: '300P',
    time: [15, 0],
  },
  {
    value: '330P',
    time: [15, 30],
  },
  {
    value: '400P',
    time: [16, 0],
  },
  {
    value: '430P',
    time: [16, 30],
  },
  {
    value: '500P',
    time: [17, 0],
  },
  {
    value: '530P',
    time: [17, 30],
  },
  {
    value: '600P',
    time: [18, 0],
  },
  {
    value: '630P',
    time: [18, 30],
  },
  {
    value: '700P',
    time: [19, 0],
  },
  {
    value: '730P',
    time: [19, 30],
  },
  {
    value: '800P',
    time: [20, 0],
  },
  {
    value: '830P',
    time: [20, 30],
  },
  {
    value: '900P',
    time: [21, 0],
  },
  {
    value: '930P',
    time: [21, 30],
  },
  {
    value: '1000P',
    time: [22, 0],
  },
  {
    value: '1030P',
    time: [22, 30],
  },
  {
    value: '1100P',
    time: [23, 0],
  },
  {
    value: '1130P',
    time: [23, 30],
  },
] as const;
