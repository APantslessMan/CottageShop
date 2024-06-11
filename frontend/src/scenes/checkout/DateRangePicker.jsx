import React, { useState } from "react";
import { DateRangePicker } from "@mui/lab";
import { LocalizationProvider, DateAdapter } from "@mui/lab/AdapterDateFns";
import DateFnsUtils from "@date-io/date-fns";

function DateRangePickerComponent() {
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter} utils={DateFnsUtils}>
      <DateRangePicker
        startText="Start Date"
        endText="End Date"
        value={dateRange}
        onChange={handleDateChange}
        renderInput={(startProps, endProps) => (
          <>
            <input {...startProps} />
            <input {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
}

export default DateRangePickerComponent;
