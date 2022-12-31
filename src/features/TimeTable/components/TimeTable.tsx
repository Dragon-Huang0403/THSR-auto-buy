import React, { useState } from "react";

import { searchTypes, stations } from "~/src/models/THSRTimeTable";
import type { RouterInputs } from "~/src/utils/trpc";
import { trpc } from "~/src/utils/trpc";

import { Select } from "./Select";

const now = new Date();
now.setDate(now.getDate() + 1);

const initialTimeTableParamsData: RouterInputs["time-table"]["searchTable"] = {
  SearchType: "S",
  Lang: "TW",
  StartStation: "NanGang",
  EndStation: "ZuoYing",
  OutWardSearchDate: now,
};

export function TimeTable() {
  const [timeTableParams, setTimeTableParams] = useState(
    initialTimeTableParamsData
  );
  const timeTableMutation = trpc["time-table"].searchTable.useMutation();
  console.log(timeTableMutation.data);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          timeTableMutation.mutate(timeTableParams);
        }}
      >
        <Select
          label="啟程站"
          value={timeTableParams.StartStation}
          onChange={(newValue) => {
            setTimeTableParams((prev) => ({ ...prev, StartStation: newValue }));
          }}
          options={stations.map(([stationValue, stationText]) => ({
            value: stationValue,
            label: stationText,
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
          value={timeTableParams.EndStation}
          onChange={(newValue) => {
            setTimeTableParams((prev) => ({ ...prev, EndStation: newValue }));
          }}
          options={stations.map(([stationValue, stationText]) => ({
            value: stationValue,
            label: stationText,
          }))}
        />
        <Select
          value={timeTableParams.SearchType}
          onChange={(newValue) => {
            setTimeTableParams((prev) => ({ ...prev, SearchType: newValue }));
          }}
          options={searchTypes.map(([searchTypeValue, searchTypeText]) => ({
            value: searchTypeValue,
            label: searchTypeText,
          }))}
        />
        <button type="submit">查詢</button>
      </form>
    </div>
  );
}
