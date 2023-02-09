// @ts-check
import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const stationSchema = z.enum([
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
]);

const dateTimeSchema = z
  .number()
  .transform((val) => new Date(val))
  .or(z.date());

export const ticketResultSchema = z
  .object({
    ticketId: z.string(),
    arrivalTime: z.string(),
    departureTime: z.string(),
    totalPrice: z.number(),
    updatedAt: dateTimeSchema,
  })
  .or(
    z.object({
      errorMessage: z.string(),
      updatedAt: dateTimeSchema,
    }),
  );

export const reservationSchema = z.object({
  id: z.string(),
  startStation: stationSchema,
  endStation: stationSchema,
  searchDate: dateTimeSchema,
  bookingMethod: z.enum(['trainNo', 'time']),
  trainNo: z.string(),
  /**
   * 0: Standard Car
   * 1: Business Car
   */
  carType: z.literal(0).or(z.literal(1)),
  /**
   * 0: No Required
   * 1: Window Seat
   * 2: Aisle Seat
   */
  seatType: z.literal(0).or(z.literal(1)).or(z.literal(2)),
  /**
   * Only allow Date in runtime, but it will be store in firestore as Timestamp
   */
  bookDate: z
    .instanceof(Timestamp)
    .or(z.date())
    .transform((value) =>
      value instanceof Timestamp
        ? new Timestamp(value.seconds, value.nanoseconds).toDate()
        : value,
    ),
  /**
   * User Info
   */
  taiwanId: z.string(),
  email: z.string(),
  phone: z.string(),
  /**
   * Ticket Counts
   */
  adult: z.number().min(0).max(10),
  child: z.number().min(0).max(10),
  disabled: z.number().min(0).max(10),
  elder: z.number().min(0).max(10),
  college: z.number().min(0).max(10),

  ticketResult: ticketResultSchema.or(z.null()),
  createdAt: dateTimeSchema,
});

export const clientReservationSchema = reservationSchema.omit({
  id: true,
  ticketResult: true,
  createdAt: true,
  updatedAt: true,
});
