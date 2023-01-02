import "react-calendar/dist/Calendar.css";

import React, { useState } from "react";
import Calendar from "react-calendar";

import type { Station } from "~/src/models/THSRTimeTable";
import { stations } from "~/src/models/THSRTimeTable";
import { selectableTime } from "~/src/utils/constants";
import {
  getFormattedDate,
  getMinSearchTime,
  padTo2Digit,
} from "~/src/utils/helper";
import type { RouterInputs } from "~/src/utils/trpc";
import { trpc } from "~/src/utils/trpc";

import { Select } from "./Select";

const minSearchTime = getMinSearchTime();

type TimeTableParams = Omit<
  RouterInputs["time-table"]["searchTable"],
  "StartStation" | "EndStation"
> & {
  StartStation: Station;
  EndStation: Station;
};

const initialTimeTableParamsData: TimeTableParams = {
  SearchType: "S",
  Lang: "TW",
  StartStation: stations[0],
  EndStation: stations[11],
  OutWardSearchDate: minSearchTime,
};

export function TimeTable() {
  const [timeTableParams, setTimeTableParams] = useState(
    initialTimeTableParamsData
  );
  const [isCalendarShown, setIsCalendarShown] = useState(false);

  const departureTableMutation = trpc["time-table"].searchTable.useMutation();

  const { data: maxDate } = trpc["time-table"].availableDate.useQuery();

  const { OutWardSearchDate } = timeTableParams;
  const selectedTime: [number, number] = [
    OutWardSearchDate.getHours(),
    OutWardSearchDate.getMinutes(),
  ];
  const isToday = OutWardSearchDate.getDate() === minSearchTime.getDate();

  return (
    <div className="flex h-screen flex-col p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          departureTableMutation.mutate({
            ...timeTableParams,
            StartStation: timeTableParams.StartStation[0],
            EndStation: timeTableParams.EndStation[0],
          });
        }}
      >
        <Select
          label="啟程站"
          value={{
            label: timeTableParams.StartStation[1],
            value: timeTableParams.StartStation,
          }}
          onChange={(newOption) => {
            setTimeTableParams((prev) => ({
              ...prev,
              StartStation: newOption.value,
            }));
          }}
          options={stations.map((station) => ({
            value: station,
            label: station[1],
          }))}
        />
        <div>
          <button
            onClick={() => {
              setTimeTableParams((prev) => ({
                ...prev,
                StartStation: prev.EndStation,
                EndStation: prev.StartStation,
              }));
            }}
          >
            交換
          </button>
        </div>
        <Select
          label="到達站"
          value={{
            label: timeTableParams.EndStation[1],
            value: timeTableParams.EndStation,
          }}
          onChange={(newOption) => {
            setTimeTableParams((prev) => ({
              ...prev,
              EndStation: newOption.value,
            }));
          }}
          options={stations.map((station) => ({
            value: station,
            label: station[1],
          }))}
        />
        <Select
          label="選擇時間"
          value={{
            label: selectedTime.map((item) => padTo2Digit(item)).join(":"),
            value: selectedTime,
          }}
          onChange={(newOption) => {
            const newDate = new Date(OutWardSearchDate);
            newDate.setHours(newOption.value[0]);
            newDate.setMinutes(newOption.value[1]);
            setTimeTableParams((prev) => ({
              ...prev,
              OutWardSearchDate: newDate,
            }));
          }}
          options={selectableTime
            .filter(
              (time) =>
                !isToday ||
                time[0] > minSearchTime.getHours() ||
                (time[0] === minSearchTime.getHours() &&
                  time[1] === minSearchTime.getMinutes())
            )
            .map((time) => ({
              value: time,
              label: time.map((item) => padTo2Digit(item)).join(":"),
            }))}
        />
        <div className="relative">
          <div>{getFormattedDate(OutWardSearchDate)}</div>
          <button
            type="button"
            onClick={() => {
              setIsCalendarShown(true);
            }}
          >
            選擇日期
          </button>
          {isCalendarShown && (
            <Calendar
              value={OutWardSearchDate}
              onChange={(newDate: Date) => {
                newDate.setHours(OutWardSearchDate.getHours());
                newDate.setMinutes(OutWardSearchDate.getMinutes());
                setTimeTableParams((prev) => ({
                  ...prev,
                  OutWardSearchDate: newDate,
                }));
                setIsCalendarShown(false);
              }}
              className="absolute"
              minDate={minSearchTime}
              maxDate={maxDate}
              view="month"
              prev2Label={null}
              next2Label={null}
            />
          )}
        </div>
        <button type="submit">查詢</button>
      </form>

      {departureTableMutation.data && (
        <div className="flex h-full flex-col overflow-hidden text-center">
          <div className="flex justify-around">
            <div>{departureTableMutation.data.Title.StartStationName}</div>
            <div>{departureTableMutation.data.Title.EndStationName}</div>
          </div>
          <div>{departureTableMutation.data.Title.TitleSplit2}</div>
          <table className="flex h-full w-full flex-col text-center">
            <thead>
              <tr className="grid grid-cols-4">
                <th>出發時間</th>
                <th>到達時間</th>
                <th>行車時間</th>
                <th>車次</th>
              </tr>
            </thead>
            <tbody className="h-full overflow-auto">
              {departureTableMutation.data.TrainItem.map((trainItem) => (
                <tr key={trainItem.TrainNumber} className="grid grid-cols-4">
                  <td>{trainItem.DepartureTime}</td>
                  <td>{trainItem.DestinationTime}</td>
                  <td>{trainItem.Duration}</td>
                  <td>{trainItem.TrainNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
