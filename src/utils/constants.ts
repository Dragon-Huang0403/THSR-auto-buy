export const MIN_TIME = new Date('2023-01-01T06:00');
export const MAX_TIME = new Date('2023-01-01T23:59');

export const CHINESE_DAYS = ['日', '一', '二', '三', '四', '五', '六'] as const;

export const BOOKING_METHODS = [
  { value: 'time', label: '選擇時間' },
  { value: 'trainNo', label: '輸入車次' },
] as const;
