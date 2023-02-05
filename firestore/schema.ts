import { z } from 'zod';

import { STATIONS } from './constants';

export const ticketResultSchema = z.object({
  ticketId: z.string(),
  arrivalTime: z.string(),
  departureTime: z.string(),
  payment: z.string(),
  errorMessage: z.string().optional(),
});

export const reservationSchema = z.object({
  id: z.string(),
  startStation: z.enum(STATIONS),
  endStation: z.enum(STATIONS),
  searchDate: z.date(),
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
  bookDate: z.date(),
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

  hasBook: z.boolean(),
  ticketResults: z.array(ticketResultSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Reservation = z.infer<typeof reservationSchema>;
export type TicketResult = z.infer<typeof ticketResultSchema>;
export type ClientReservation = Omit<
  Reservation,
  'id' | 'hasBook' | 'ticketResults' | 'createdAt' | 'updatedAt'
>;
