type ZeroToTen = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type BookingOptions = {
  selectStartStation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  selectDestinationStation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
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
   * Format: "radio[0-9]+"
   * Need to get from page.
   */
  toTimeInputField: string;
  toTimeTable:
    | "1201A"
    | "1230A"
    | "600A"
    | "630A"
    | "700A"
    | "730A"
    | "800A"
    | "830A"
    | "900A"
    | "930A"
    | "1000A"
    | "1030A"
    | "1100A"
    | "1130A"
    | "1200N"
    | "1230P"
    | "100P"
    | "130P"
    | "200P"
    | "230P"
    | "300P"
    | "330P"
    | "400P"
    | "430P"
    | "500P"
    | "530P"
    | "600P"
    | "630P"
    | "700P"
    | "730P"
    | "800P"
    | "830P"
    | "900P"
    | "930P"
    | "1000P"
    | "1030P"
    | "1100P"
    | "1130P";
  /**
   * Adult Tickets
   */
  "ticketPanel:rows:0:ticketAmount": `${ZeroToTen}F`;
  /**
   * Child Tickets (6-11)
   */
  "ticketPanel:rows:1:ticketAmount": `${ZeroToTen}H`;
  /**
   * Disabled ticket (Taiwan only)
   */
  "ticketPanel:rows:2:ticketAmount": `${ZeroToTen}W`;

  /**
   * Elder ticket (Taiwan only)
   */
  "ticketPanel:rows:3:ticketAmount": `${ZeroToTen}E`;
  /**
   * College student ticket (Taiwan only)
   */
  "ticketPanel:rows:4:ticketAmount": `${ZeroToTen}P`;
};

export type PostAvailableTrainsRequest = BookingOptions & {
  "wicket:interface": ":0:BookingS1Form::IFormSubmitListener";
  "BookingS1Form:hf:0": "";
  bookingMethod: string;
  /**
   * Format: "yyyy/mm/dd"
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
   * Format: [A-Z]([0-9]){9}
   */
  dummyId: string;
  dummyPhone: string;
  email: string;
  /**
   * Format: "radio[0-9]+"
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
