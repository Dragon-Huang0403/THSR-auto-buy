import type { NextPage } from "next";

import type { SearchBarParams } from "../components/SearchBar";
import { SearchBar } from "../components/SearchBar";
import { TimeTable } from "../components/TimeTable";
import { stations } from "../models/THSRTimeTable";
import { getMinSearchTime } from "../utils/helper";
import { trpc } from "../utils/trpc";

const minSearchTime = getMinSearchTime();

const initialTimeTableParamsData: SearchBarParams = {
  SearchType: "S",
  Lang: "TW",
  StartStation: stations[0],
  EndStation: stations[11],
  OutWardSearchDate: minSearchTime,
};

const SearchPage: NextPage = () => {
  const departureTableMutation = trpc["time-table"].searchTable.useMutation();

  const { data: maxDate } = trpc["time-table"].availableDate.useQuery();

  return (
    <div className="flex h-screen flex-col p-5">
      <SearchBar
        initialValue={initialTimeTableParamsData}
        minSearchDate={minSearchTime}
        maxSearchDate={maxDate}
        onSubmit={(timeTableParams) => {
          departureTableMutation.mutate({
            ...timeTableParams,
            StartStation: timeTableParams.StartStation[0],
            EndStation: timeTableParams.EndStation[0],
          });
        }}
      />

      {departureTableMutation.data && (
        <TimeTable value={departureTableMutation.data} />
      )}
    </div>
  );
};

export default SearchPage;
