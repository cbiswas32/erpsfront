import { MenuIconMap, subMenuRouteConfig } from "./routeConfig";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const setStoredUserDetails = (loginUserData) => {
    localStorage.setItem("loggedInUserBKQA", loginUserData );
};
export const getStoredUserDetails = () => {
    const user = localStorage.getItem("loggedInUserBKQA");
    return user ? JSON.parse(user) : null;
};
export const removedStoredUserDetails = () => {
    localStorage.removeItem("loggedInUserBKQA");
};
export const getUserDetailsObj = () =>{
    let details = getStoredUserDetails()
    let res = {
        ...details?.userdetailDTO,
        ...details?.RoledetailDTO
    }
    return res || null
}
export const getJWTToken = () =>{
    let details = getStoredUserDetails()
    let res = details.token
    return res || null
}

export const checkUserLoggedIn = () => {
    let result =  getStoredUserDetails();
    if(result){
        return true
    }
    else{
        return false
    }
} 
const getSubMenuRoute = (menuNameIn, subMenuNameIn) => {
    const resObj =  subMenuRouteConfig?.find(x=> x.menuName === menuNameIn && x.submenuName === subMenuNameIn)
    if(resObj){
        return resObj.route
    }else{
        return 'notfound/page'
    }
}
const  getMenuIcon = (name) => {
    const menuObj = MenuIconMap?.find(x => x.menuName === name);
    if(menuObj){
        return menuObj.icon
    }
    else{
        return <ReportGmailerrorredIcon />
    }
}

export const getMenuDetails = () =>{
    
    let details = getStoredUserDetails()
    const res = details && details.menuDetailList?.sort((a, b) => a.mainSortOrder - b.mainSortOrder)?.map(ele => {
        let modSubMenuArr = ele?.subMenuDetailList?.map(subEle => {
            return {
                'id': subEle.subFunctionMasterId,
                'route': getSubMenuRoute(ele.functionShortName, subEle.subFunctionShortName ),
                'submenuName': subEle.subFunctionShortName
            }
        })
        return {
            'id': ele.functionMasterId,
            'menuName' : ele.functionShortName,
            'icon': getMenuIcon(ele.functionShortName),
            'subMenuArr': modSubMenuArr
        }
       
    })
    if(res){
        res.unshift(
            {
                 menuName: "Dashboard",
                   id: 1,
                    icon: <DashboardIcon sx={{'fontSize' : 20 }}/>, // MUI icon for Dashboard
                    route: "dashboard",
                   subMenuArr: [],
              }
        )
    }
    return res || null
}

export const getRole = () => {
    let details = getStoredUserDetails()
    let roleDetails = details.RoledetailDTO;
    return roleDetails
}

export const getAcceessMatrix = (menuName, subMenuName) => {
    let details = getStoredUserDetails()
    let menuObj = details?.menuDetailList?.find(x => x.functionShortName == menuName)
    if(menuObj){
        let subMenuObj = menuObj?.subMenuDetailList?.find(x => x.subFunctionShortName === subMenuName);
        if(subMenuObj){
            let accessTypeList =  subMenuObj?.accessDetailList?.map( x => x.accessType)
            if(accessTypeList?.length > 0){
                let accrssMatrix = {}
                accessTypeList.forEach(access => {
                    accrssMatrix[access] = true
                })
                return accrssMatrix
            }
        }
    }
    return {}
}