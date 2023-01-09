/**
 * Reference: https://gist.github.com/chochinlu/2b305dfd1ede28a27fe21c833215d019
 */

import { intRangeArray } from './helper';

// wiki 身分證驗證規則  https://zh.wikipedia.org/wiki/%E4%B8%AD%E8%8F%AF%E6%B0%91%E5%9C%8B%E5%9C%8B%E6%B0%91%E8%BA%AB%E5%88%86%E8%AD%89#%E7%B7%A8%E8%99%9F%E8%A6%8F%E5%89%87

// 中華民國身分證字號英文字首的編號規則數字
const firstLetterMapping = {
  A: '10',
  B: '11',
  C: '12',
  D: '13',
  E: '14',
  F: '15',
  G: '16',
  H: '17',
  I: '34',
  J: '18',
  K: '19',
  M: '21',
  N: '22',
  O: '35',
  P: '23',
  Q: '24',
  T: '27',
  U: '28',
  V: '29',
  W: '32',
  X: '30',
  Z: '33',
  L: '20',
  R: '25',
  S: '26',
  Y: '31',
} as const;

// 驗證規則需要相乘的數
const authMultiplier = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1] as const;

export const checkTaiwanId = (pid: string) => {
  // 長度要為10
  if (pid.length !== 10) return { result: false, msg: '身分證字號長度不正確' };

  // 開頭第一個為英文字母, 後為9個阿拉伯數字, 第一個數字拿來區分性別，男性為1、女性為2
  const re = /^[A-Za-z][12]\d{8}/;
  if (!re.test(pid)) return { result: false, msg: '身分證格式錯誤' };

  // 驗證規則
  const [first, ...nums] = [...pid];
  const source = [
    ...firstLetterMapping[
      first?.toUpperCase() as keyof typeof firstLetterMapping
    ],
    ...nums,
  ]
    .map((value, i) => Number(value) * (authMultiplier[i] as number))
    .reduce((a, b) => a + b, 0);

  if (source % 10 !== 0) return { result: false, msg: '驗證失敗' };

  return { result: true };
};

const keys = Object.keys(
  firstLetterMapping,
) as (keyof typeof firstLetterMapping)[];
const genders = [1, 2];
const nums = intRangeArray(0, 10);
const times = intRangeArray(0, 8); // for count

const genRestNums = () => {
  const restNum = times.map(() =>
    Number(nums[Math.floor(Math.random() * nums.length)]),
  );

  return restNum.reduce((a, b) => a.toString() + b.toString(), '');
};

/**
 * @param sex 1=男生, 2=女生
 */
export const getRandomTaiwanId = (sex?: 1 | 2): string => {
  // gen first letter
  const key = keys[Math.floor(Math.random() * keys.length)];

  // gen second number 1 or 2
  const firstNum = sex ?? genders[Math.floor(Math.random() * genders.length)];

  const id = `${key}${firstNum}${genRestNums()}`;

  const { result } = checkTaiwanId(id);
  return result ? id : getRandomTaiwanId();
};
