import type { z } from "zod";

export type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [Acc["length"], ...Acc]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type EnumerateStringArray<
  N extends number,
  Postfix extends string = "",
  Acc extends number[] = []
> = Acc["length"] extends N
  ? []
  : [
      `${Acc["length"]}${Postfix}`,
      ...EnumerateStringArray<N, Postfix, [Acc["length"], ...Acc]>
    ];

type EnumerateZodLiteral<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? []
  : [
      z.ZodLiteral<Acc["length"]>,
      ...EnumerateZodLiteral<N, [Acc["length"], ...Acc]>
    ];

type DropFirstInTuple<T extends any[]> = ((...args: T) => any) extends (
  arg: any,
  ...rest: infer U
) => any
  ? U
  : T;

export type DropFirstFewInTuple<
  T extends number,
  Target extends any[],
  Acc extends number[] = []
> = Acc["length"] extends T
  ? Target
  : DropFirstFewInTuple<T, DropFirstInTuple<Target>, [...Acc, T]>;

/**
 * Not include max
 */
export type ZodIntLiteralRange<
  Min extends number,
  Max extends number
> = DropFirstFewInTuple<Min, EnumerateZodLiteral<Max>>;
