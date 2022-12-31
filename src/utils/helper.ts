function padTo2Digit(num: number) {
  return num.toString().padStart(2, "0");
}

export function getFormattedDate(date: Date) {
  return [
    date.getFullYear(),
    padTo2Digit(date.getMonth() + 1),
    padTo2Digit(date.getDate()),
  ].join("/");
}

export function getFormattedTime(date: Date) {
  return [padTo2Digit(date.getHours()), padTo2Digit(date.getMinutes())].join(
    ":"
  );
}
