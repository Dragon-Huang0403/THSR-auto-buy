import got from 'got';
import { CookieJar } from 'tough-cookie';

import type {
  BookingByDateOptions,
  BookingByTrainNoOptions,
  BookingByTrainNoRequest,
  PostAvailableTrainsRequest,
  PostConfirmTrainRequest,
  PostSubmitTicketRequest,
  SearchBookedTicketRequest,
} from '~/src/models/thsr';
import { getFormattedDate } from '~/src/utils/helper';

const searchBaseUrl = 'https://www.thsrc.com.tw';
const baseUrl = 'https://irs.thsrc.com.tw';
export const thsrUrls = {
  baseUrl: baseUrl,
  timeTableSearch: `${searchBaseUrl}/TimeTable/Search`,
  availableDate: (date: Date) =>
    `${searchBaseUrl}/RawData/EAIIRS_${getFormattedDate(date).join('')}.xml`,
  bookingPage: `${baseUrl}/IMINT/`,
};

const defaultHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  Connection: 'keep-alive',
  'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3',
};

export const availableTrainRequestFiller: Omit<
  PostAvailableTrainsRequest,
  'bookingMethod' | 'homeCaptcha:securityCode' | keyof BookingByDateOptions
> = {
  'wicket:interface': ':0:BookingS1Form::IFormSubmitListener',
  'BookingS1Form:hf:0': '',
  toTrainIDInputField: '',
  backTimeInputField: '',
};

export const confirmTrainRequestFiller: Pick<
  PostConfirmTrainRequest,
  'BookingS2Form:hf:0' | 'wicket:interface'
> = {
  'wicket:interface': ':1:BookingS2Form::IFormSubmitListener',
  'BookingS2Form:hf:0': '',
};

export const submitTicketRequestFiller: Omit<
  PostSubmitTicketRequest,
  | 'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup'
  | 'dummyId'
  | 'dummyPhone'
  | 'email'
  | 'passengerCount'
  | 'wicket:interface'
> = {
  'BookingS3FormSP:hf:0': '',
  diffOver: 1,
  agree: 'on',
  TgoError: 1,
  backHome: '',
  isGoBackM: '',
  idInputRadio: 0,
  isSPromotion: 1,
};

export const bookingByTainIdRequestFiller: Omit<
  BookingByTrainNoRequest,
  'bookingMethod' | 'homeCaptcha:securityCode' | keyof BookingByTrainNoOptions
> = {
  'wicket:interface': ':0:BookingS1Form::IFormSubmitListener',
  'BookingS1Form:hf:0': '',
  toTimeTable: '',
};

export function getClient() {
  const cookieJar = new CookieJar();
  const client = got.extend({
    cookieJar,
    headers: defaultHeaders,
    followRedirect: true,
    timeout: {
      request: 1000 * 10,
    },
  });
  return client;
}

export const searchBookedTicketRequestFiller: Pick<
  SearchBookedTicketRequest,
  'wicket:interface' | 'HistoryForm:hf:0' | 'SubmitButton'
> = {
  'wicket:interface': ':0:HistoryForm::IFormSubmitListener',
  'HistoryForm:hf:0': '',
  SubmitButton: '查詢',
};

export const visitHistoryPageResultFiller = {
  'wicket:bookmarkablePage': ':tw.com.mitac.webapp.thsr.viewer.History',
} as const;
