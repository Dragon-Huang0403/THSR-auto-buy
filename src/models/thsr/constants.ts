import { intRangeArray } from '~/src/utils/helper';

export const stationObjects = {
  NanGang: { name: '南港', value: '1' },
  TaiPei: { name: '台北', value: '2' },
  BanQiao: { name: '板橋', value: '3' },
  TaoYuan: { name: '桃園', value: '4' },
  XinZhu: { name: '新竹', value: '5' },
  MiaoLi: { name: '苗栗', value: '6' },
  TaiZhong: { name: '台中', value: '7' },
  ZhangHua: { name: '彰化', value: '8' },
  YunLin: { name: '雲林', value: '9' },
  JiaYi: { name: '嘉義', value: '10' },
  TaiNan: { name: '台南', value: '11' },
  ZuoYing: { name: '左營', value: '12' },
} as const;

export const stations = [
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

export const stationValues = intRangeArray(1, 13);

export const searchTypes = {
  S: { name: '單程', value: 0 },
  R: { name: '去回程', value: 1 },
} as const;

export const adultTicketValues = intRangeArray(0, 11, 'F');
export const childTicketValues = intRangeArray(0, 11, 'H');
export const disabledTicketValues = intRangeArray(0, 11, 'W');
export const elderTicketValues = intRangeArray(0, 11, 'E');
export const collegeTicketValues = intRangeArray(0, 11, 'P');

export const toTimeTableValues = [
  '1201A',
  '1230A',
  '600A',
  '630A',
  '700A',
  '730A',
  '800A',
  '830A',
  '900A',
  '930A',
  '1000A',
  '1030A',
  '1100A',
  '1130A',
  '1200N',
  '1230P',
  '100P',
  '130P',
  '200P',
  '230P',
  '300P',
  '330P',
  '400P',
  '430P',
  '500P',
  '530P',
  '600P',
  '630P',
  '700P',
  '730P',
  '800P',
  '830P',
  '900P',
  '930P',
  '1000P',
  '1030P',
  '1100P',
  '1130P',
] as const;
