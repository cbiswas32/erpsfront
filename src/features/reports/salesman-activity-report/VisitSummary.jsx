import React, { useMemo } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, Divider, Avatar
} from '@mui/material';
import { CalendarToday, LocationOn, ShowChart, Store, FiberNew, PeopleAlt } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function VisitSummary({ data, filters }) {
  const summary = useMemo(() => {
    if (!data || data.length === 0) return null;

    const start = dayjs(filters.startDate);
    const end = dayjs(filters.endDate);
    const days = end.diff(start, 'day') + 1;
    const uniqueVisitDates = new Set(
      data.map(v => dayjs(v.created_at).format('YYYY-MM-DD'))
    );
   
    const uniqueDaysCount = uniqueVisitDates.size;

    const totalVisits = data.length;
    const avgPerDay = (totalVisits / days).toFixed(2);

    const dealerVisits = data.filter(v => v.dealer_id !== null).length;
    const newDealerVisits = data.filter(v => v.is_new_dealer).length;

    // Dealer wise count
    const dealerCountMap = {};
    data.forEach(v => {
      if (v.dealer_id) {
        dealerCountMap[v.dealer_name] = (dealerCountMap[v.dealer_name] || 0) + 1;
      }
    });

    return {
      timePeriod: `${start.format('DD MMM YYYY')} → ${end.format('DD MMM YYYY')}`,
      totalVisits,
      avgPerDay,
      dealerVisits,
      newDealerVisits,
      dealerCountMap,
      uniqueDaysCount,
      days
    };
  }, [data, filters]);

  if (!summary) return null;

  const statCards = [
    { label: 'Time Period', value: summary.timePeriod, icon: <CalendarToday />, color: '#1976d2' },
    { label: 'Total Places', value: summary.totalVisits, icon: <LocationOn />, color: '#2e7d32' },
    { label: 'Avg Visit Log/Day', value: summary.avgPerDay, icon: <ShowChart />, color: '#ff9800' },
    { label: 'Dealer Visits', value: summary.dealerVisits, icon: <Store />, color: '#9c27b0' },
    { label: 'New Dealer Visits', value: summary.newDealerVisits, icon: <FiberNew />, color: '#d32f2f' },
    { label: 'Working Days(Visits)', value: summary.uniqueDaysCount, icon: <PeopleAlt />, color: '#0f58c5ff' },
  ];

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f9fafb, #f1f5f9)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        maxWidth: 'md',
        mx:'auto'
      }}
      
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        📊 Sales Visit Summary
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={6} key={idx}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Avatar sx={{ bgcolor: stat.color }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dealer wise visits */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Dealer-wise Visit Count
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(summary.dealerCountMap).map(([dealer, count]) => (
            <Chip
              key={dealer}
              label={`${dealer} - ${count} Visit`}
              variant="outlined"
              sx={{
                fontWeight: 500,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: '#fff',
                  borderColor: 'primary.main'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
