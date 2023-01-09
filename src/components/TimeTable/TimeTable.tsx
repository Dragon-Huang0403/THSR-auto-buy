import React from 'react';

import type { TimeTable as TimeTableData } from '~/src/models/thsr';

interface TimeTableProps {
  value: TimeTableData;
}

export function TimeTable({ value }: TimeTableProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden text-center">
      <div className="flex justify-around">
        <div>{value.Title.StartStationName}</div>
        <div>{value.Title.EndStationName}</div>
      </div>
      <div>{value.Title.TitleSplit2}</div>
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
          {value.TrainItem.map((trainItem) => (
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
  );
}
