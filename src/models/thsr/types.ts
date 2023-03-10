import type { ValueOf } from 'next/dist/shared/lib/constants';

import type {
  adultTicketValues,
  childTicketValues,
  collegeTicketValues,
  disabledTicketValues,
  discountType,
  elderTicketValues,
  searchTypes,
  stationObjects,
  timeOptions,
} from './constants';

type DiscountType = ValueOf<typeof discountType>;

export type Stations = typeof stationObjects;
export type Station = keyof Stations;
export type StationName = ValueOf<Stations>['name'];
export type StationValue = ValueOf<Stations>['value'];
type StationNo =
  | `0${Exclude<StationValue, '10' | '11' | '12'>}`
  | '10'
  | '11'
  | '12';

/**
 * S 為單程
 * R 為去回程
 */
export type SearchType = keyof typeof searchTypes;
export type SearchTypeValue = typeof searchTypes[SearchType]['value'];
type Language = 'TW';

/**
 * @pattern "yyyy/mm/dd"
 */
type TSHRDate = string;

/**
 * @pattern "hh:mm"
 */
type TSHRTime = string;

export type PostTHSRTimeTableRequest = {
  SearchType: SearchType;
  Lang: Language;
  StartStation: Station;
  EndStation: Station;
  OutWardSearchDate: TSHRDate;
  OutWardSearchTime: TSHRTime;
  ReturnSearchDate?: TSHRDate;
  ReturnSearchTime?: TSHRTime;
  DiscountType?: DiscountType;
};

export type PostTHSRTimeTableResponse =
  | {
      success: true;
      data: TimeTableData;
    }
  | { success: false };

interface TimeTableData {
  DepartureTable: TimeTable;
  DestinationTable: TimeTable;
  PriceTable: PriceTable;
}

/**
 * Length of arrays in Coach, Business, Unreserved are three.
 *
 * Values of arrays in Coach, Business, Unreserved represent the prices of
 * ["全票", "孩童票/敬老票/愛心票", "團體票"]
 */
interface PriceTable {
  Coach: Price[];
  Business: Price[];
  Unreserved: Price[];
  Column: PriceTableColumn[];
}

/**
 *  Note: will be "-" if unavailable.
 */
type Price = `$${number}` | '-';

type DiscountValue = `${number}`;
type DiscountText = `${number}折`;

interface PriceTableColumn {
  Discount: DiscountValue;
  ColumnName: DiscountText;
  Double_CoachPrice: number;
  CoachPrice: Price;
  BusinessPrice: Price;
  Unreserved: Price;
}
export interface TimeTable {
  Title: Title;
  TrainItem: TrainItem[];
}

type NonReservedCar = `${number}-${number}`;

export interface TrainItem {
  TrainNumber: `${number}`;
  DepartureTime: TSHRTime;
  DestinationTime: TSHRTime;
  Duration: TSHRTime;
  NonReservedCar: NonReservedCar;
  Discount: Discount[];
  Note: string;
  Sequence: number;
  StationInfo: StationInfo[];
  IsCrossNight: boolean;
  RunDate: string;
  DepartureTime_Order: string;
  DestinationTime_Order: string;
  DiscountWord?: unknown;
}

interface StationInfo {
  StationNo: StationNo;
  StationName: StationName;
  DepartureTime: TSHRTime;
  Show: boolean;
  ColorClass: string;
}

interface Discount {
  Id: ValueOf<DiscountType>;
  Name: string;
  Value: DiscountText;
  /**
   * @pattern in Hex Coded
   */
  Color: string;
  Discount: DiscountValue;
}

interface Title {
  StartStationName: StationName;
  EndStationName: StationName;
  /**
   * @pattern "yyyy/mm/dd (日) 06:30"
   */
  TitleSplit1: string;
  /**
   * @pattern "yyyy/mm/dd"
   */
  TitleSplit2: string;
}

export type AdultTicketValue = typeof adultTicketValues[number];
export type ChildTicketValue = typeof childTicketValues[number];
export type DisabledTicketValue = typeof disabledTicketValues[number];
export type ElderTicketValue = typeof elderTicketValues[number];
export type CollegeTicketValue = typeof collegeTicketValues[number];

export type TimeOption = typeof timeOptions[number];
export type ToTimeTableValue = TimeOption['value'];
