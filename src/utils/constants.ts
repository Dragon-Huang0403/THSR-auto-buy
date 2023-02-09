export const MIN_TIME = new Date('2023-01-01T06:00');
export const MAX_TIME = new Date('2023-01-01T23:59');

export const CHINESE_DAYS = ['日', '一', '二', '三', '四', '五', '六'] as const;

export const BOOKING_METHODS = [
  { value: 'time', label: '選擇時間' },
  { value: 'trainNo', label: '輸入車次' },
] as const;

export const MAX_BOOK_DAYS = 30;

export const TICKET_TYPES = [
  {
    value: 'adult',
    name: '全票',
  },
] as const;

export const EARLY_BOOK_DAY = 28;

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
