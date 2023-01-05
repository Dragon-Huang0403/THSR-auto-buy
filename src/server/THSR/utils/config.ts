import type {
  BookingOptions,
  PostAvailableTrainsRequest,
  PostConfirmTrainRequest,
  PostSubmitTicketRequest,
} from "./bookingRequestSchema";

const searchBaseUrl = "https://www.thsrc.com.tw";
const baseUrl = "https://irs.thsrc.com.tw";
export const thsrUrls = {
  baseUrl: baseUrl,
  timeTableSearch: `${searchBaseUrl}/TimeTable/Search`,
  availableDate: `${searchBaseUrl}/RawData/EAIIRS_20230102.xml`,
  bookingPage: `${baseUrl}/IMINT/`,
};

export const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  Connection: "keep-alive",
  "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
};

export const availableTrainRequestFiller: Omit<
  PostAvailableTrainsRequest,
  "bookingMethod" | "homeCaptcha:securityCode" | keyof BookingOptions
> = {
  "wicket:interface": ":0:BookingS1Form::IFormSubmitListener",
  "BookingS1Form:hf:0": "",
  toTrainIDInputField: "",
  backTimeInputField: "",
};

export const confirmTrainRequestFiller: Pick<
  PostConfirmTrainRequest,
  "BookingS2Form:hf:0" | "wicket:interface"
> = {
  "wicket:interface": ":1:BookingS2Form::IFormSubmitListener",
  "BookingS2Form:hf:0": "",
};

export const submitTicketRequestFiller: Omit<
  PostSubmitTicketRequest,
  | "TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup"
  | "dummyId"
  | "dummyPhone"
  | "email"
  | "passengerCount"
> = {
  "wicket:interface": ":2:BookingS3Form::IFormSubmitListener",
  "BookingS3FormSP:hf:0": "",
  diffOver: 1,
  agree: "on",
  TgoError: 1,
  backHome: "",
  isGoBackM: "",
  idInputRadio: 0,
  isSPromotion: 1,
};
