import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DataGridTable from "../../components/Tables/DataGridTable";
import Chip from "@mui/material/Chip";
const paginationModel = { page: 0, pageSize: 5 };


function LocationTable({ locationList, getLocationListAPICall, onClickEdit }) {
  const columns = [
    {
      field: "slNo",
      headerName: "SL No.",
      headerClassName: "table-header",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "locationName",
      headerName: "Location Name",
      headerClassName: "table-header",
      flex: 2,
      minWidth: 150,
    },
    {
      field: "address",
      headerName: "Address",
      headerClassName: "table-header",
      flex: 3,
      minWidth: 200,
    },
    {
      field: "stateName",
      headerName: "State",
      headerClassName: "table-header",
      flex: 2,
      minWidth: 80,
    },
    {
      field: "districtName",
      headerName: "District",
      headerClassName: "table-header",
      flex: 2,
      minWidth: 80,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      headerClassName: "table-header",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "locationTypeNames",
      headerName: "Location Types",
      headerClassName: "table-header",
      flex: 3,
      minWidth: 300,
      renderCell: (params) => (
        <Box >
          {params?.row?.locationTypeNames?.map((l) => {
           // const randomColor = getRandomLightColor();
            return (
              <Chip
                key={l}
                label={l}
                sx={{
                  fontSize: '10px',
                  color: "text.primary",
                  margin: "1px", 
                }}
              ></Chip>
            );
          })}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      headerClassName: "table-header",
      sortable: false,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => (
        <EditIcon
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => onClickEdit(params.row)}
        />
      ),
    },
  ];

  const rows = useMemo(() => {
    return (locationList || []).map((item, index) => ({
      slNo: index + 1,
      id: item.locationId,
      ...item,
    }));
  }, [locationList]);

  return (
    <Box sx={{ height: "65vh", m: 2 }}>
      <DataGridTable
        columns={columns}
        rows={rows}
        paginationModel={paginationModel}
        columnVisibilityModel={{ id: false }}
      />
    </Box>
  );
}

export default LocationTable;
