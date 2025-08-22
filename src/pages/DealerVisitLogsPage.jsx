import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Paper, MenuItem, FormControl,   Select, InputLabel, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import dayjs from 'dayjs';
import { getDealersByReportingUserService, getDealerVisitLogsService, saveDealerVisitLogService } from '../services/dealerService';
import PageWrapper from '../layouts/PageWrapper';
import { getAcceessMatrix } from '../utils/loginUtil';
import { useUI } from '../context/UIContext';


const commonActivities = [
  // Sales & Orders
  "Satrt Travelling",
  "Took Order",
  "Collected Order Requirements",
  "Promoted New Product",
  "Demonstrated Product",
  "Sample Provided",

  // Payments
  "Collected Payment",
  "Outstanding Payment Follow-up",

  // Relationship Building
  "Introduced Self",
  "Introduced Company",
  "Discussed Partnership Opportunities",
  "Resolved Complaint",  
  "Follow-up Visit",
  "Customer Feedback Taken",

  // Marketing
  "Promotional Material Delivered",

  // Training & Support
  "Explained Product Usage",
  "Explained Warranty/Guarantee",
  "After-Sales Support",
 
  // Market Intelligence
  "Competitor Activity Observed",
  "Collected Market Data",
  "Price Survey Conducted",
  "Customer Preferences Survey",

  // Misc
  "Introduced New Salesman",
  "Updated Dealer Information",
  "Agreement Signed",
  "Meeting with Dealer Owner",
  "Meeting with Store Manager",
  "Other"
];


export default function DealerVisitLogsPage() {
  const { showSnackbar, showLoader, hideLoader } = useUI();
  const [logs, setLogs] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [openDialog, setOpenDialog] = useState(false);
  const [accessMatrix, setAccessMatrix] = useState({});

  const [formData, setFormData] = useState({
    salesmanId: '',
    dealerId: '',
    isNewDealer: false,
    newDealerDetails: '',
    activitiesDone: '',
    locationLat: '',
    locationLng: '',
    locationAddress: '',
    outcomeDetails: '',
    selectedActivities: []
  });


  const handleGetCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // setFormData((prev) => ({
        //   ...prev,
        //   locationLat: lat.toString(),
        //   locationLng: lng.toString(),
        // }));

        if(lat && lng){
            setFormData((prev) => ({
            ...prev,
            locationLat: lat.toString(),
            locationLng: lng.toString(),
          }));
          showLoader()
          try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            locationAddress: data.display_name || "",
          }));
            showSnackbar("Current location fetched successfully!", 'success')
        } catch (error) {
          showSnackbar("Current location fetched successfully, but address fetching failed! Please Retry!", 'warning')
          console.error("Reverse geocoding failed", error);
        }
         hideLoader()

        }
        else{
          showSnackbar("Error in fetching current location! Please Retry!", 'error')
        }
      
        
      },
      (error) => {
        console.error("Error getting location:", error);
         showSnackbar("Error in fetching current location! Please Retry!", 'error')
      }
    );
  } else {
     showSnackbar("Geolocation is not supported by this browser. Please retry in chrome or update your browser!", 'error')
    alert("Geolocation is not supported by this browser.");
  }
};
  
   const handleActivitySelect = (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const combinedText = [...value, ...prev.activitiesDone.split(",").map(v => v.trim()).filter(Boolean)]
        .filter((v, i, arr) => arr.indexOf(v) === i) // unique values
        .join(", ");
      return {
        ...prev,
        selectedActivities: value,
        activitiesDone: combinedText
      };
    });
  };


  
  useEffect(() => {
       fetchDealers()
       const access = getAcceessMatrix('Activity Tracking', 'Salesman Activity');
        setAccessMatrix(access);
      fetchLogs()
  }, [])

  const fetchLogs = async () => {
    showLoader()
    try {
      const data = await getDealerVisitLogsService({
        startDate: selectedDate,
        endDate: selectedDate
      });
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
    hideLoader()
  };
  const fetchDealers = async () => {
    try {
      const data = await getDealersByReportingUserService();
      setDealers(data || []);
    } catch (err) {
        setDealers([])
        showSnackbar("Error in fetching Dealers")
      console.error('Error fetching dealers:', err);
    }
  };

  const handleSave = async () => {

    const {
    salesmanId,
    dealerId,
    isNewDealer,
    newDealerDetails,
    activitiesDone,
    locationLat,
    locationLng,
    locationAddress,
    outcomeDetails,
  } = formData;

  // Prepare error object
  let newErrors = {};
  //if (!salesmanId) newErrors.salesmanId = "Salesman is required";
  if (!isNewDealer && !dealerId) newErrors.dealerId = "Dealer is required";
  if (isNewDealer && !newDealerDetails) newErrors.newDealerDetails = "New dealer details are required";
  if (!activitiesDone) newErrors.activitiesDone = "Activities Done is required";
  if (!locationLat) newErrors.locationLat = "Latitude is required";
  if (!locationLng) newErrors.locationLng = "Longitude is required";
  if (!locationAddress) newErrors.locationAddress = "Address is required";
  if (!outcomeDetails) newErrors.outcomeDetails = "Outcome Details are required";

  // Stop if any error
  if (Object.keys(newErrors).length > 0) {
    showSnackbar(Object.values(newErrors), "error");
    return;
  }

    showLoader()
    try {
      await saveDealerVisitLogService({
        //salesmanId: formData.salesmanId,
        dealerId: formData.dealerId || null,
        isNewDealer: formData.isNewDealer,
        newDealerDetails: formData.isNewDealer ? formData.newDealerDetails : null,
        activitiesDone: formData.activitiesDone,
        locationLat: formData.locationLat || null,
        locationLng: formData.locationLng || null,
        locationAddress: formData.locationAddress || null,
        outcomeDetails: formData.outcomeDetails,
        // visitDate: selectedDate
      });
      showSnackbar("Activity Saved Successfully!", "success")

      setOpenDialog(false);
      setFormData({
        salesmanId: '',
        dealerId: '',
        isNewDealer: false,
        newDealerDetails: '',
        activitiesDone: '',
        locationLat: '',
        locationLng: '',
        locationAddress: '',
        outcomeDetails: '',
        selectedActivities: []
      });
      fetchLogs();
    } catch (err) {
       showSnackbar("Failed to Save Activity!", "error")
      console.error('Error saving log:', err);
    }
    hideLoader()
  };

  
       const ActionButtonsArr = [
        {
          showHeaderButton: true,
          buttonText: 'Add Activity',
          buttonCallback: () => {setOpenDialog(true)},
          buttonIcon: <AddIcon fontSize='small' />,
          access: accessMatrix?.create ?? false,
        }
      ];

  return (
    <PageWrapper title="Dealer Visit Logs" actionButtons={ActionButtonsArr}>
      <Box display="flex" alignItems="center" justifyContent={'center'} mb={2} mt={3} gap={2} maxWidth={'md'} mx='auto'>
  <TextField
    type="date"
    label="Select Date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    size='small'
  />
  <Button
    variant="contained"
    onClick={fetchLogs} // call the API only on button click
  >
    Get Logs
  </Button>
</Box>

     {/* Logs Timeline */}
{logs.length === 0 ? (
   <Box display="flex" alignItems="center" justifyContent={'center'} mb={2} mt={3} gap={2} maxWidth={'md'} mx='auto'>
  <Typography variant="body1" color="error">
    No activities found for {dayjs(selectedDate).format('DD MMM YYYY')}
  </Typography>
   </Box>

) : (
  <Box maxWidth={'md'} mx='auto' p={2}>
     <Grid container spacing={2}>
    {logs.map((log, index) => (
      <Grid item xs={12} key={index}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            background: '#fdfdfd',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Timeline indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 6,
              height: '100%',
              bgcolor: log.is_new_dealer ? '#097a42ff' : '#d37f00ff',
              borderRadius: 1
            }}
          />

          <Box sx={{ ml: 3 }}>
            <Chip label={log.is_new_dealer ? "New Dealer" : "Existing Dealer "} color={log.is_new_dealer ? 'success' : 'warning'} sx={{mb:2}}></Chip>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {log.is_new_dealer ? log.new_dealer_details : log.dealer_name }
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Salesman: {log.salesman_name  || 'N/A'} - {log.salesman_login_id} 
            </Typography>

            {/* Activities as chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {log.activities_done?.split(',').map((act) => (
                <Chip
                  key={act}
                  label={act.trim()}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Outcome: {log.outcome_details || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Log Time: {dayjs(log.created_at).add(5.5, 'hour').format('DD MMM YYYY, hh:mm A')}
            </Typography>

            {/* Location */}
            {log.location_lat && log.location_lng && (
              <Box
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                {/* <img
                  src={`https://www.openstreetmap.org/staticmap.php?mlat=${parseFloat(log.location_lat)}&mlon=${parseFloat(log.location_lng)}&zoom=15&size=600x200&markers=${parseFloat(log.location_lat)},${parseFloat(log.location_lng)},red`}
                  alt="Dealer location"
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                /> */}
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  sx={{ mt: 0.5, p: 1 }}
                >
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${log.location_lat}&mlon=${log.location_lng}#map=15/${log.location_lat}/${log.location_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#1976d2' }}
                  >
                    View entry location on map
                  </a>
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    ))}
  </Grid>

  </Box>
 
)}

      {/* Add Activity Dialog */}
    <Dialog open={openDialog} onClose={() => {
      setFormData({
        salesmanId: '',
        dealerId: '',
        isNewDealer: false,
        newDealerDetails: '',
        activitiesDone: '',
        locationLat: '',
        locationLng: '',
        locationAddress: '',
        outcomeDetails: '',
        selectedActivities: []
      });
      setOpenDialog(false)
      }} fullWidth maxWidth="sm">
  <DialogTitle>Add Dealer Visit Activity</DialogTitle>
  <DialogContent>
    {/* Salesman ID */}
    {/* <TextField
      label="Salesman ID"
      fullWidth
      value={formData.salesmanId}
      onChange={(e) => setFormData({ ...formData, salesmanId: e.target.value })}
      sx={{ mb: 2 }}
    /> */}

    {/* Is New Dealer radio */}
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Dealer Type</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant={formData.isNewDealer ? "contained" : "outlined"}
            onClick={() => setFormData({ ...formData, isNewDealer: true, dealerId: "" })}
          >
            New Dealer
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={!formData.isNewDealer ? "contained" : "outlined"}
            onClick={() => setFormData({ ...formData, isNewDealer: false, newDealerDetails: "" })}
          >
            Existing Dealer
          </Button>
        </Grid>
      </Grid>
    </Box>

    {/* If existing dealer → dropdown */}
    {!formData.isNewDealer && (
      <TextField
        select
        label="Select Dealer"
        fullWidth
        value={formData.dealerId}
        onChange={(e) => setFormData({ ...formData, dealerId: e.target.value })}
        sx={{ mb: 2 }}
      >
        {dealers.map((dealer) => (
          <MenuItem key={dealer.dealerId} value={dealer.dealerId}>
            {dealer.dealerCode} - {dealer.dealerName}
          </MenuItem>
        ))}
      </TextField>
    )}

    {/* If new dealer → new dealer details input */}
    {formData.isNewDealer && (
      <TextField
        label="New Dealer Details"
        fullWidth
        value={formData.newDealerDetails}
        onChange={(e) => setFormData({ ...formData, newDealerDetails: e.target.value })}
        sx={{ mb: 2 }}
      />
    )}
        {/* Multi-select for Common Activities */}
 
     <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel id="common-activities-label">Common Activities</InputLabel>
  <Select
    labelId="common-activities-label"
    multiple
    value={formData.selectedActivities}
    onChange={handleActivitySelect}
    label="Common Activities"
    renderValue={(selected) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {selected.map((value) => (
          <Chip key={value} label={value} />
        ))}
      </Box>
    )}
  >
    {commonActivities.map((activity) => (
      <MenuItem key={activity} value={activity}>
        {activity}
      </MenuItem>
    ))}
  </Select>
</FormControl>

   

    {/* Activities */}
    <TextField
      multiline
      minRows={4}
      label="Activities Done"
      fullWidth
      value={formData.activitiesDone}
      onChange={(e) => setFormData({ ...formData, activitiesDone: e.target.value })}
      sx={{ mb: 2 }}
    />

    {/* Outcome */}
    <TextField
      minRows={3}
      label="Outcome Details"
      fullWidth
      multiline
      value={formData.outcomeDetails}
      onChange={(e) => setFormData({ ...formData, outcomeDetails: e.target.value })}
      sx={{ mb: 2 }}
    />

    <Button
  variant="contained"
  fullWidth
  size="large"
  startIcon={<MyLocationIcon sx={{ fontSize: 28 }} />}
  onClick={handleGetCurrentLocation}
  sx={{
    mb: 2,
    py: 2,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
      transform: 'scale(1.02)',
      boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
    },
    transition: 'all 0.2s ease-in-out',
  }}
>
  Get Current Location
</Button>
{/* Location Map Preview */}
{formData.locationLat && formData.locationLng && (
  (() => {
    const lat = parseFloat(formData.locationLat);
    const lon = parseFloat(formData.locationLng);

    if (isNaN(lat) || isNaN(lon)) return null;

    const bboxOffset = 0.005; // small bounding box around marker
    const minLon = lon - bboxOffset;
    const minLat = lat - bboxOffset;
    const maxLon = lon + bboxOffset;
    const maxLat = lat + bboxOffset;

    return (
      <Box
        sx={{
          mb: 2,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #e0e0e0',
        }}
      >
        <iframe
          title="Location Map"
          width="100%"
          height="250"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`}
          style={{ border: "none", pointerEvents: "none" }}
        />
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 0.5 }}
        >
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
          >
            View on OpenStreetMap
          </a>
        </Typography>
      </Box>
    );
  })()
)}




    {/* Location */}
    <TextField
    disabled
      label="Location Latitude"
      fullWidth
      value={formData.locationLat}
      onChange={(e) => setFormData({ ...formData, locationLat: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
     disabled
      label="Location Longitude"
      fullWidth
      value={formData.locationLng}
      onChange={(e) => setFormData({ ...formData, locationLng: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
     disabled
      label="Location Address"
      fullWidth
      multiline
      minRows={2}
      value={formData.locationAddress}
      onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
      sx={{ mb: 2 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() =>  {
      setOpenDialog(false)
      setFormData({
        salesmanId: '',
        dealerId: '',
        isNewDealer: false,
        newDealerDetails: '',
        activitiesDone: '',
        locationLat: '',
        locationLng: '',
        locationAddress: '',
        outcomeDetails: '',
        selectedActivities: []
      });
    }}>Cancel</Button>
    <Button variant="contained" onClick={handleSave}>Save</Button>
  </DialogActions>
</Dialog>
    </PageWrapper>
  );
}
