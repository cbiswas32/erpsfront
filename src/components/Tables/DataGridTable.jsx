import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { exportExcel } from '../../utils/excelExport';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  Pagination,
  Select,
  MenuItem,
} from '@mui/material';

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <Button size='small' onClick={exportExcel} startIcon={<DownloadIcon fontSize='small' />}>
      PDF
    </Button>
    <Button size='small' onClick={exportExcel} startIcon={<DownloadIcon fontSize='small' />}>
      Excel
    </Button>
  </GridToolbarContainer>
);

function QuickSearchToolbar() {
  return (
    <Box sx={{ p: 1 }}>
      <GridToolbarQuickFilter
        sx={{
          '& .MuiInputBase-root': {
            height: '30px',
            minWidth: '150px',
            fontSize: '0.75rem',
          },
        }}
      />
    </Box>
  );
}

export default function DataGridTable({
  columns,
  rows,
  paginationModel,
  showToolber = true,
  enableCheckboxSelection = false,
  columnVisibilityModel = {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [searchText, setSearchText] = React.useState('');

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  if (isMobile) {
    return (
      <Box height="100%" width="100%" display="flex" flexDirection="column" pt={2} pb={2} mb={2}>
        <Box
          px={2}
          pb={1}
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          <Box
            component="input"
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            style={{
              width: '60%',
              padding: '6px 10px',
              fontSize: '0.8rem',
              borderRadius: 6,
              border: `1px solid ${theme.palette.divider}`,
              outline: 'none',
              backgroundColor: theme.palette.background.default,
            }}
          />
        </Box>

        <Box flexGrow={1} overflow="auto" px={2}>
          {paginatedRows.length === 0 ? (
            <Typography variant="body2" sx={{ textAlign: 'center', py: 4 }}>
              No data found
            </Typography>
          ) : (
            paginatedRows.map((row) => (
              <Card
                key={row.id}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  mb: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[1],
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent>
                  {columns?.map((col, index) => {
                    const value = col.valueGetter ? col.valueGetter({ row }) : row[col.field];
                    if (col.field === 'slNo') {
                      return (
                        <Box key={col.field} sx={{ mb: 2 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          >
                            {col.headerName}: {value}
                          </Typography>
                        </Box>
                      );
                    }
                    if (col.field === 'actions') {
                      return (
                        <Box key={col.field} sx={{ mb: 1, display: 'flex', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ flex: '0 0 40%' }}>
                            {col.headerName}
                          </Typography>
                          {col.renderCell ? col.renderCell({ row }) : null}
                        </Box>
                      );
                    }
                    return (
                      <Box
                        key={col.field}
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          gap: 2,
                          borderBottom: index !== columns.length - 1 ? `1px dashed ${theme.palette.divider}` : 'none',
                          pb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ flex: '0 0 40%' }}>
                          {col.headerName}
                        </Typography>
                        <Typography variant="body2" sx={{ flex: '1' }}>
                          {col.renderCell
                            ? col.renderCell({ row, field: col.field, value })
                            : value}
                        </Typography>
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
          <Box display="flex" flexDirection="column-reverse" alignItems="flex-end">
            <Typography variant="overline">Rows:</Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value);
                setPage(1);
              }}
              sx={{
                fontSize: '0.75rem',
                minWidth: '50px',
                '& .MuiSelect-select': { padding: '4px 8px' },
                '& .MuiSvgIcon-root': { fontSize: '1rem' },
              }}
            >
              {[5, 10, 15, 20].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      checkboxSelection={enableCheckboxSelection}
      disableColumnMenu
      slots={{ toolbar: showToolber ? QuickSearchToolbar : null }}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[5, 10, 15, 20]}
      columnVisibilityModel={columnVisibilityModel}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],

         '& .table-header': {
          backgroundColor:  theme.palette.primary.main,
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderBottom: `1px solid ${theme.palette.divider}`,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
        },

        '& .MuiDataGrid-cell': {
          fontSize: '0.75rem',
          borderBottom: `1px solid ${theme.palette.divider}`,
        },

        '& .MuiDataGrid-row:hover': {
          backgroundColor: theme.palette.action.hover,
        },

        '& .MuiDataGrid-footerContainer': {
          backgroundColor: theme.palette.background.default,
          borderTop: `1px solid ${theme.palette.divider}`,
        },

        '& .MuiCheckbox-root.Mui-checked': {
          color: theme.palette.primary.main,
        },
      }}
    />
  );
}
