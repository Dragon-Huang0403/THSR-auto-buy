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

/**
 * Firestore @type {Date} as @type {Timestamp} but without any Timestamp methods, only properties
 * So needed to be convert to Timestamp and then toDate
 */
const dateSchema = z
  .instanceof(Timestamp)
  .or(z.date())
  .transform((value) =>
    value instanceof Timestamp
      ? new Timestamp(value.seconds, value.nanoseconds).toDate()
      : value,
  );

export const ticketResultSchema = z
  .object({
    ticketId: z.string(),
    arrivalTime: z.string(),
    departureTime: z.string(),
    totalPrice: z.number(),
    updatedAt: dateSchema,
  })
  .or(
    z.object({
      errorMessage: z.string(),
      updatedAt: dateSchema,
    }),
  );

export const reservationSchema = z.object({
  id: z.string(),
  startStation: stationSchema,
  endStation: stationSchema,
  searchDate: dateSchema,
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
  bookDate: dateSchema,
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
  createdAt: dateSchema,
});

export const clientReservationSchema = reservationSchema.omit({
  id: true,
  ticketResult: true,
  createdAt: true,
  bookDate: true,
});
