import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Grid, Paper, Chip, Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import SalesmanMap from './SalesmanMap';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


export default function SalesmanActivityReportAccordion({data = [], baseLocationLat, baseLocationLon}) {

    // Group data by date (Indian Time)
 const groupedData = useMemo(() => {
    return data.reduce((acc, log) => {
      const dateKey = dayjs(log.created_at)
        .add(5.5, 'hour') // Convert to IST
        .format('DD MMM YYYY');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    }, {});
  }, [data]);

  const dateKeys = useMemo(() => {
    return Object.keys(groupedData).sort(
      (a, b) => dayjs(a, 'DD MMM YYYY') - dayjs(b, 'DD MMM YYYY')
    );
  }, [groupedData]);
  const dailyDistances = useMemo(() => {
    if (!Object.keys(groupedData).length) return {};

    const result = {};
    Object.entries(groupedData).forEach(([date, visits]) => {
      const sorted = [...visits].sort(
        (a, b) => dayjs(a.created_at) - dayjs(b.created_at)
      );

      let total = 0;
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        total += calculateDistance(
          parseFloat(prev.location_lat),
          parseFloat(prev.location_lng),
          parseFloat(curr.location_lat),
          parseFloat(curr.location_lng)
        );
      }
      result[date] = parseFloat(total.toFixed(2));
    });
    return result;
  }, [groupedData]);

  console.log(groupedData)
  return (
    <Box maxWidth="md" mx="auto" mt={3}>
    <SalesmanMap groupedData={groupedData} />
      {dateKeys.map((date) => (
        <Accordion key={date} sx={{ borderRadius: 2, mb: 2, mt:2, overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ background: 'linear-gradient(90deg, #1976d2, #42a5f5)', color: '#fff' }}
          >
            <Typography variant="h6">{date}</Typography>
            <Typography sx={{ ml: 2, opacity: 0.8 }}>
              {groupedData[date].length} visits
            </Typography>
            {groupedData[date].length > 1 && dailyDistances[date] != 0 && <Typography sx={{ ml: 2, opacity: 0.8 }}>
              Approx {dailyDistances[date]} Km travelled
            </Typography>}
          </AccordionSummary>
          <AccordionDetails sx={{ background: '#fafafa' }}>
            
            <Grid container spacing={2}>
              {groupedData[date].map((log) => (
                <Grid item xs={12} key={log.visit_id}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      position: 'relative'
                    }}
                  >
                    {/* Dealer/New Dealer */}
                    <Chip
                      label={log.is_new_dealer ? 'New Dealer' : 'Existing Dealer'}
                      color={log.is_new_dealer ? 'success' : 'warning'}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {log.is_new_dealer ? log.new_dealer_details : log.dealer_name}
                    </Typography>

                    {/* Salesman Info */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Salesman: {log.salesman_name} ({log.salesman_login_id})
                    </Typography>

                    {/* Activities */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {log.activities_done?.split(',').map((act, i) => (
                        <Chip key={i} label={act.trim()} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>

                    {/* Outcome */}
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Outcome: {log.outcome_details}
                    </Typography>

                    {/* Time */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Time: {dayjs(log.created_at).add(5.5, 'hour').format('hh:mm A')}
                    </Typography>

                    {/* Location */}
                    {log.location_lat && log.location_lng && (
                      <Link
                        href={`https://www.openstreetmap.org/?mlat=${log.location_lat}&mlon=${log.location_lng}#map=15/${log.location_lat}/${log.location_lng}`}
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                        sx={{ fontSize: 13 }}
                      >
                        View Location on Map
                      </Link>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
