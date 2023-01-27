import type { StationValue, ToTimeTableValue } from './types';

/**
 * 0 ~ 10
 */
type TicketAmount<T extends string> = `${number}${T}`;
export type CommonBookingOptions = {
  selectStartStation: StationValue;
  selectDestinationStation: StationValue;
  /**
   * @pattern "yyyy/mm/dd"
   */
  toTimeInputField: string;
  /**
   * 0: Standard Car
   * 1: Business Car
   */
  'trainCon:trainRadioGroup': 0 | 1;
  /**
   * 0: No Required
   * 1: Window Seat
   * 2: Aisle Seat
   */
  'seatCon:seatRadioGroup': 0 | 1 | 2;
  /**
   * 0: Single Trip
   * 1: Round Trip
   */
  'tripCon:typesoftrip': 0 | 1;
  /**
   * Adult Tickets
   */
  'ticketPanel:rows:0:ticketAmount': TicketAmount<'F'>;
  /**
   * Child Tickets (6-11)
   */
  'ticketPanel:rows:1:ticketAmount': TicketAmount<'H'>;
  /**
   * Disabled ticket (Taiwan only)
   */
  'ticketPanel:rows:2:ticketAmount': TicketAmount<'W'>;
  /**
   * Elder ticket (Taiwan only)
   */
  'ticketPanel:rows:3:ticketAmount': TicketAmount<'E'>;
  /**
   * College student ticket (Taiwan only)
   */
  'ticketPanel:rows:4:ticketAmount': TicketAmount<'P'>;
};

export type BookingByDateOptions = {
  toTimeTable: ToTimeTableValue;
} & CommonBookingOptions;

export type PostAvailableTrainsRequest = BookingByDateOptions & {
  'wicket:interface': ':0:BookingS1Form::IFormSubmitListener';
  'BookingS1Form:hf:0': '';
  /**
   * Need to get from page.
   * @pattern /radio\d+/
   */
  bookingMethod: string;
  /**
   * @pattern "yyyy/mm/dd"
   */
  toTrainIDInputField: '';
  backTimeInputField: '';
  'homeCaptcha:securityCode': string;
};

export type PostConfirmTrainRequest = {
  'wicket:interface': ':1:BookingS2Form::IFormSubmitListener';
  'BookingS2Form:hf:0': '';
  /**
   * Get from html page
   */
  'TrainQueryDataViewPanel:TrainGroup': string;
};

export type PostSubmitTicketRequest = {
  'wicket:interface': `:${1 | 2}:BookingS3Form::IFormSubmitListener`;
  'BookingS3FormSP:hf:0': '';
  diffOver: 1;
  /**
   * Taiwanese ID
   * @pattern /[A-Z](\d){9}/
   */
  dummyId: string;
  dummyPhone: string;
  email: string;
  /**
   * @pattern /radio\d+/
   */
  'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup': string;
  agree: 'on';
  idInputRadio: 0;
  TgoError: 1;
  backHome: '';
  isGoBackM: '';
  passengerCount: number;
  isSPromotion: 1;
};

export type BuyerInfo = Pick<
  PostSubmitTicketRequest,
  'dummyId' | 'dummyPhone' | 'email'
>;

export type BookingByTrainNoOptions = {
  toTrainIDInputField: string;
} & CommonBookingOptions;

export type BookingByTrainNoRequest = {
  'wicket:interface': ':0:BookingS1Form::IFormSubmitListener';
  'BookingS1Form:hf:0': '';
  /**
   * @pattern /radio\d+/
   */
  bookingMethod: string;
  toTimeTable: '';
  'homeCaptcha:securityCode': string;
} & BookingByTrainNoOptions;

export type SearchBookedTicketRequest = {
  'wicket:interface': ':0:HistoryForm::IFormSubmitListener';
  'HistoryForm:hf:0': '';
  /**
   * 0: 身分證字號
   * 1: 護照/居留證/入出境許可證號碼
   */
  typesofid: 0 | 1;
  /**
   * TaiwanID
   */
  rocId: string;
  orderId: string;
  'divCaptcha:securityCode': string;
  SubmitButton: '查詢';
};
