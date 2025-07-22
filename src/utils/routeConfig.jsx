import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Assessment';
import AuditIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ElectricMopedIcon from '@mui/icons-material/ElectricMoped';

export const MenuIconMap =   [
    {
      "menuName": "Dashboard",
      "id": 1,
      "icon": <SpaceDashboardIcon  sx={{ fontSize: 16 }} />
    },
    {
      "menuName": "Location Management",
      "id": 2,
      "icon": <LocationOnIcon sx={{ fontSize: 20 }}  />
    },
    {
      "menuName": "Product",
      "id": 3,
      "icon": <ElectricMopedIcon sx={{ fontSize: 20 }} />
    },
    {
      "menuName": "Inventory Management",
      "id": 4,
      "icon": <ReportIcon sx={{ fontSize: 20 }}/>
    },
    {
      "menuName": "Special Audits",
      "id": 5,
      "icon": <AuditIcon sx={{ fontSize: 20 }} />
    },
    {
      "menuName": "General Audits",
      "id": 6,
      "icon": <ListAltIcon sx={{ fontSize: 20 }} />
    },
    {
      "menuName": "Settings",
      "id": 7,
      "icon": <SettingsIcon sx={{ fontSize: 20 }} />
    },
    {
      "menuName": "Execution",
      "id": 8,
      "icon": <AssignmentIcon sx={{ fontSize: 20 }} />
    },
    {
      "menuName": "System Administration",
      "id": 9,
      "icon": <ManageAccountsIcon sx={{ fontSize: 20 }} />
    }
  ]
  

export  const subMenuRouteConfig = [
    {
      "menuName": "Location Management",
      "submenuName": "State",
      "id": 21,
      "route": "/bs/state"
    },
    {
      "menuName": "Location Management",
      "submenuName": "District",
      "id": 22,
      "route": "/bs/district"
    },
    {
      "menuName": "Location Management",
      "submenuName": "Location Type",
      "id": 23,
      "route": "/bs/locationType"
    },
    {
      "menuName": "Location Management",
      "submenuName": "Location",
      "id": 24,
      "route": "/bs/location"
    },
    {
      "menuName": "Location Management",
      "submenuName": "User Location Map",
      "id": 25,
      "route": "/bs/userLocationMap"
    },
    // {
    //   "menuName": "Branch Setup",
    //   "submenuName": "Audit",
    //   "id": 25,
    //   "route": "/bs/audit"
    // },
    // {
    //   "menuName": "Branch Setup",
    //   "submenuName": "Audit Branch Map",
    //   "id": 26,
    //   "route": "/bs/audit-branch-map"
    // },
    // {
    //   "menuName": "Branch Setup",
    //   "submenuName": "Audit Plan",
    //   "id": 26,
    //   "route": "/bs/audit-plan"
    // },
    {
      "menuName": "Product",
      "submenuName": "Product Category",
      "id": 31,
      "route": "/product/productCategory"
    },
    {
      "menuName": "Product",
      "submenuName": "Product Feature",
      "id": 32,
      "route": "/product/productFeature"
    },
    {
      "menuName": "Product",
      "submenuName": "Products",
      "id": 33,
      "route": "/product/productPage"
    },
   
    {
      "menuName": "Inventory Management",
      "submenuName": "Vendor",
      "id": 41,
      "route": "/inventoryManagemnt/vendor"
    },
    {
      "menuName": "Inventory Management",
      "submenuName": "Purchase Order",
      "id": 42,
      "route": "/inventoryManagemnt/po"
    },
    {
      "menuName": "Special Audits",
      "submenuName": "Special Audit",
      "id": 51,
      "route": "/audits/SpecialAudit"
    },
    {
      "menuName": "Special Audits",
      "submenuName": "Special Audit Branch Map",
      "id": 52,
      "route": "/audits/SpecialAuditBranchMap"
    },
    {
      "menuName": "Special Audits",
      "submenuName": "Special Audit Plan",
      "id": 53,
      "route": "/audits/SpecialAuditPlan"
    },
    {
      "menuName": "General Audits",
      "submenuName": "General Audit Plan",
      "id": 54,
      "route": "/audits/GeneralAuditPlan"
    },
    {
      "menuName": "Settings",
      "submenuName": "Change Password",
      "id": 61,
      "route": "/changepassword"
    },
    {
      "menuName": "Execution",
      "submenuName": "Execution Dashboard",
      "id": 71,
      "route": "ex/execution-dashboard"
    },
    {
      "menuName": "System Administration",
      "submenuName": "User Management",
      "id": 81,
      "route": "sa/user"
    },
    {
      "menuName": "System Administration",
      "submenuName": "App Version",
      "id": 82,
      "route": "/appversion"
    },
    {
      "menuName": "System Administration",
      "submenuName": "Access Management",
      "id": 83,
      "route": "sa/userrolemap"
    }
  ]
  