import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import DataGridTable from "../../components/Tables/DataGridTable"; // assuming you have this

const paginationModel = { page: 0, pageSize: 10 };

function InventoryAdjustmentTable({ adjustments = [] }) {
  const columns = [
    {
      field: "adjustment_date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      headerClassName: "table-header",
      valueGetter: (value) => {
        if (value) {
          return dayjs(value).format("YYYY-MM-DD");
        }
        return "-"; // Handle cases where the date might be null or undefined
      },
    },
    {
      field: "product_name",
      headerName: "Product",
      flex: 2,
      headerClassName: "table-header",
      minWidth: 160,
    },
    {
      field: "location_name",
      headerName: "Location",
      flex: 2,
      headerClassName: "table-header",
      minWidth: 160,
    },
    {
      field: "quantity_change",
      headerName: "Quantity Change",
      flex: 1,
      headerClassName: "table-header",
      minWidth: 140,
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 3,
      headerClassName: "table-header",
      minWidth: 200,
    },
{
  field: "adjusted_by_user",
  headerName: "Adjusted By",
  flex: 2,
  minWidth: 200,
  headerClassName: "table-header",
  renderCell: (params) => {
    const row = params.row;
    return (
      <strong>
        {row.adjusted_by_user} ({row.adjusted_by_user_login_id})
       
      </strong>
    );
  }
}

  ];

  const rows = useMemo(() => {
    return (
      adjustments.map((item, index) => ({
        ...item,
        id: item.adjustment_id, // required for DataGrid
      })) || []
    );
  }, [adjustments]);

  return (
    <Box sx={{ height: "65vh", m: 2 }}>
      <DataGridTable
        columns={columns}
        rows={rows}
        paginationModel={paginationModel}
        columnVisibilityModel={{ adjustment_id: false }}
      />
    </Box>
  );
}

export default InventoryAdjustmentTable;
