export const formatMonthYear = (value) => {
  if (!value || typeof value !== 'string' || !/^\d{4}-\d{2}$/.test(value)) {
    return '-';
  }

  const [year, month] = value.split('-');
  const date = new Date(`${value}-01`); // e.g., 2025-06-01

  const isValidDate = !isNaN(date.getTime());
  if (!isValidDate) return '-';

  const monthName = date.toLocaleString('default', { month: 'long' });
  return `${monthName}, ${year}`;
};

export const convertDateTimeToReadable = (dateTimeString) => {
  // 1. Parse the input string into a Date object
  // Replace space with 'T' to ensure correct parsing as ISO 8601 for consistency
  // Although "YYYY-MM-DD HH:MM:SS" is often parsed correctly by most browsers,
  // explicit 'T' makes it unambiguous, especially for UTC/local time interpretation.
  const dateObj = new Date(dateTimeString.replace(' ', 'T'));

  // Check if the date parsing was successful
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date string provided:", dateTimeString);
    return { date: "Invalid Date", time: "Invalid Time" };
  }

  // 2. Format the date part to "Month Day, Year"
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedDate = dateFormatter.format(dateObj);

  // 3. Format the time part to "HH:MM AM/PM"
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  });
  const formattedTime = timeFormatter.format(dateObj);

  return { date: formattedDate, time: formattedTime };
}

export const formatDateToReadable = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '-';

  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };

  return date.toLocaleDateString('en-US', options);
};

export const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return '-';

  const [hour, minute] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};


export const formatDDMMYYYY = (input) =>{
    if(!input){
        return ''
    }
    let date = new Date(input);
    //console.log('formatDDMMYYYY', date)
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
export const formatYYYYMMDD = (input) =>{
    if(!input){
        return ''
    }
    
    let date = new Date(input);
    //console.log('formatYYYYMMDD', date)
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let year = date.getFullYear();
    console.log(input, `${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
}