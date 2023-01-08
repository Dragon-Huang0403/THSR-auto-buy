import type {
  adultTicketValues,
  childTicketValues,
  collegeTicketValues,
  disabledTicketValues,
  elderTicketValues,
  StationValue,
  toTimeTableValues,
} from "~/src/models/thsr";

type AdultTicketValues = typeof adultTicketValues;
type ChildTicketValues = typeof childTicketValues;
type DisabledTicketValues = typeof disabledTicketValues;
type ElderTicketValues = typeof elderTicketValues;
type CollegeTicketValues = typeof collegeTicketValues;

type ToTimeTableValue = typeof toTimeTableValues[number];

export type BookingOptions = {
  selectStartStation: StationValue;
  selectDestinationStation: StationValue;
  /**
   * 0: Standard Car
   * 1: Business Car
   */
  "trainCon:trainRadioGroup": 0 | 1;
  /**
   * 0: Single Trip
   * 1: Round Trip
   */
  "tripCon:typesoftrip": 0 | 1;
  /**
   * 0: No Required
   * 1: Window Seat
   * 2: Aisle Seat
   */
  "seatCon:seatRadioGroup": 0 | 1 | 2;
  /**
   * Need to get from page.
   * @pattern /radio\d+/
   */
  toTimeInputField: string;
  toTimeTable: ToTimeTableValue;
  /**
   * Adult Tickets
   */
  "ticketPanel:rows:0:ticketAmount": AdultTicketValues[number];
  /**
   * Child Tickets (6-11)
   */
  "ticketPanel:rows:1:ticketAmount": ChildTicketValues[number];
  /**
   * Disabled ticket (Taiwan only)
   */
  "ticketPanel:rows:2:ticketAmount": DisabledTicketValues[number];

  /**
   * Elder ticket (Taiwan only)
   */
  "ticketPanel:rows:3:ticketAmount": ElderTicketValues[number];
  /**
   * College student ticket (Taiwan only)
   */
  "ticketPanel:rows:4:ticketAmount": CollegeTicketValues[number];
};

export type PostAvailableTrainsRequest = BookingOptions & {
  "wicket:interface": ":0:BookingS1Form::IFormSubmitListener";
  "BookingS1Form:hf:0": "";
  bookingMethod: string;
  /**
   * @pattern "yyyy/mm/dd"
   */
  toTrainIDInputField: "";
  backTimeInputField: "";
  "homeCaptcha:securityCode": string;
};

export type PostConfirmTrainRequest = {
  "wicket:interface": ":1:BookingS2Form::IFormSubmitListener";
  "BookingS2Form:hf:0": "";
  /**
   * Get from html page
   */
  "TrainQueryDataViewPanel:TrainGroup": string;
};

export type PostSubmitTicketRequest = {
  "wicket:interface": ":2:BookingS3Form::IFormSubmitListener";
  "BookingS3FormSP:hf:0": "";
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
  "TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup": string;
  agree: "on";
  idInputRadio: 0;
  TgoError: 1;
  backHome: "";
  isGoBackM: "";
  passengerCount: number;
  isSPromotion: 1;
};

export type BuyerInfo = Pick<
  PostSubmitTicketRequest,
  "dummyId" | "dummyPhone" | "email"
>;
