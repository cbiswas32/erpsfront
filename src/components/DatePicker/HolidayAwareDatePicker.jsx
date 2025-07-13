import React, { useEffect, useState } from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { getAllHolidayList } from "../../services/auditPlanServices";
import { useUI } from "../../context/UIContext";

// const holidays = [
//   { date: "2025-01-05", description: "Sunday" },
//   { date: "2025-01-11", description: "2nd Saturday" },
//   { date: "2025-01-12", description: "Sunday" },
//   { date: "2025-01-19", description: "Sunday" },
//   { date: "2025-01-25", description: "4th Saturday" }
// ];

const HolidayAwareDatePicker = ({
  label = "Select Date",
  size = "small",
  value,                   // <-- string "YYYY-MM-DD"
  onChange = () => {},     // <-- returns string "YYYY-MM-DD"
  error = false,
  helperText = "",
  disabled = false,
  minDate = null,
  fullWidth = true,
}) => {
  const { showLoader, hideLoader, showSnackbar } = useUI();
  const [showDialog, setShowDialog] = useState(false);
  const [tempValue, setTempValue] = useState(null); // dayjs object
  const [holidayReason, setHolidayReason] = useState("");
  const [holidays, setHolidays] = useState([])


  



  const getHolidayListAPICall = ( state) => {
    const currentYear = dayjs().year();
    const nextYear = dayjs().add(1, 'year').year();
    const yearArr = [currentYear, nextYear]
        showLoader()
        getAllHolidayList(yearArr).then(res => {
            
            if(res?.length >0 && state){
                let stateObj = res?.find(x => x.state_name == state)
                
                let result  = stateObj?.holidays || []
                 setHolidays(result)
            }
            else{
                 showSnackbar(`No holiday list found for ${state}`, 'warning')
                 setHolidays(res || [])
            }
            console.log("Holiday List:", res, " For state: ", state)
           

        }).catch(err => {
            console.log(err)
            setHolidays([])
            showSnackbar('Failed to fectch holiday list!', 'error')
        }).finally(() => {
            hideLoader()
        })
  }

  const handleDateChange = (newDate) => {
    if (!newDate || !newDate.isValid()) {
      onChange("");
      return;
    }

    const formatted = newDate.format("YYYY-MM-DD");
    const holiday = holidays.find((h) => h.date === formatted);

    if (holiday) {
      setHolidayReason(holiday.description);
      setTempValue(newDate);
      setShowDialog(true);
    } else {
      onChange(formatted); // return string
    }
  };

  const handleConfirm = () => {
    if (tempValue && tempValue.isValid()) {
      onChange(tempValue.format("YYYY-MM-DD"));
    }
    setTempValue(null);
    setShowDialog(false);
  };

  const handleCancel = () => {
    setTempValue(null);
    setShowDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null} // convert string to dayjs
        onOpen={() => {getHolidayListAPICall( "WEST BENGAL")}}
        onChange={handleDateChange}
        format="DD/MM/YYYY"
        minDate={minDate ? dayjs(minDate) : undefined}
        slotProps={{
          textField: {
            fullWidth: true,
            size,
            disabled,
            error,
            helperText,
          },
        }}
      />

      <Dialog open={showDialog} onClose={handleCancel}>
        <DialogTitle>Holiday Warning</DialogTitle>
        <DialogContent>
          Selected date is a <strong>{holidayReason}</strong>. Do you want to continue?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error">No</Button>
          <Button onClick={handleConfirm} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default HolidayAwareDatePicker;
