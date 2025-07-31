import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import DataGridTable from "../../components/Tables/DataGridTable"; // your custom component

const paginationModel = { page: 0, pageSize: 10 };

function InventoryIssueTable({issues = [], productIdUnitMap={}}) {
  const columns = [
    {
      field: "issue_date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      headerClassName: "table-header",
      valueGetter: (params) =>
        params ? dayjs(params).format("YYYY-MM-DD") : "-",
    },
    {
      field: "issue_number",
      headerName: "Issue Number",
      flex: 1.2,
      minWidth: 140,
      headerClassName: "table-header",
    },
    {
      field: "location_name",
      headerName: "Location",
      flex: 1.5,
      minWidth: 160,
      headerClassName: "table-header",
    },
    {
      field: "issued_to",
      headerName: "Issued To",
      flex: 1.5,
      minWidth: 140,
      headerClassName: "table-header",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 2,
      minWidth: 180,
      headerClassName: "table-header",
    },
    {
      field: "item_summary",
      headerName: "Items",
      flex: 2.5,
      minWidth: 240,
      headerClassName: "table-header",
      renderCell: (params) => {
        const row = params.row;
        console.log('row', row.items)
        return row.items?.length ? (
          <Box>
            {row.items.map((item, idx) => (
              <div key={idx}>
                • {item.product_name} — {item.quantity_issued} {productIdUnitMap[item.product_id]}
              </div>
            ))}
          </Box>
        ) : (
          "-"
        );
      },
    },
  ];

  const rows = useMemo(() => {
    return (
      issues.map((item) => ({
        ...item,
        id: item.issue_id, // required for DataGrid
        item_summary: item.items || [],
      })) || []
    );
  }, [issues]);

  return (
    <Box sx={{ height: "65vh", m: 2 }}>
      <DataGridTable
        autoHeightRow ={ true}
        columns={columns}
        rows={rows}
        paginationModel={paginationModel}
        columnVisibilityModel={{ issue_id: false }}
      />
    </Box>
  );
}

export default InventoryIssueTable;
