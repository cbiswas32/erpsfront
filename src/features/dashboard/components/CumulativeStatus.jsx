import React from 'react';
import Grid2 from '@mui/material/Grid2';
import CardContainer from './CardContainer';
import IndividualStatusContent from './IndividualStatusContent';
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MapIcon from "@mui/icons-material/Map";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupIcon from "@mui/icons-material/Group";

import Inventory2Icon from '@mui/icons-material/Inventory2';       // Products
import BuildIcon from '@mui/icons-material/Build';                 // Work Orders
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Suppliers
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';     // Purchase Orders
import StoreIcon from '@mui/icons-material/Store';                 // Warehouses
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';         // Employees

// const items = [
//   { name: "Products", icon: <Inventory2Icon />, count: 150 },
//   { name: "Work Orders", icon: <BuildIcon />, count: 35 },
//   { name: "Suppliers", icon: <LocalShippingIcon />, count: 22 },
//   { name: "Purchase Orders", icon: <ReceiptLongIcon />, count: 58 },
//   { name: "Warehouses", icon: <StoreIcon />, count: 5 },
//   { name: "Employees", icon: <PeopleAltIcon />, count: 120 }
// ];

const Grid = Grid2

const items = [
  { name: "Funds", icon: <VolunteerActivismIcon />, count: 120 },
  { name: "Locations", icon: <WorkOutlineIcon />, count: 45 },
  { name: "LTS", icon: <MapIcon />, count: 4 },
  { name: "Projects", icon: <AssignmentIcon />, count: 75 },
  { name: "Branches", icon: <AccountTreeIcon />, count: 18 },
  { name: "Users", icon: <GroupIcon />, count: 240 }
];

function CumulativeStatus(props) {
    return (
        <>
            {
                items && items?.map( (x, index) => 
                    <Grid key={index} size={{ xs: 6, sm: 6, md: 2 }}>
                        <CardContainer title={''}>
                            <IndividualStatusContent mainTitle={x.name} icon={x.icon} count={x.count} />
                        </CardContainer>
                    </Grid>
                )
            }       
            
            
        </>
    );
}

export default CumulativeStatus;