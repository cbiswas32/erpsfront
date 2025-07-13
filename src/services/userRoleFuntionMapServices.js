import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";
async function fetchFunctionsListService() {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
      

        let response = await axiosPost(
           'roleMap/listAllFunctions', requestBody
        );
        if (response && response.status && response.data && response.data.responseObject) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  async function fetchRoleMapDetailsService() {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
      

        let response = await axiosPost(
           'roleMap/view', requestBody
        );
        if (response && response.status && response.data && response.data.responseObject) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  async function fetchAccessTypeListService() {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
      

        let response = await axiosPost(
           'roleMap/listAccessTypes', requestBody
        );
        if (response && response.status && response.data && response.data.responseObject) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async function saveRoleFunctionMapService(roleFunctionMapDTOList) {
    console.log("roleFunctionMapDTOList", roleFunctionMapDTOList)
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        requestBody.roleFunctionMapDTOList =  roleFunctionMapDTOList
      

        let response = await axiosPost(
           'roleMap/save', requestBody
        );
        if (response && response.status ) {
          resolve(response.data);
        
          
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
 



  export {fetchFunctionsListService, fetchRoleMapDetailsService, fetchAccessTypeListService, saveRoleFunctionMapService}