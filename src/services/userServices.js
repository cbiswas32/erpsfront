import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";
async function fetchUserListService(projectIdList) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        // let loggInUserDetails = getUserDetailsObj()
        // requestBody.dataAccessDTO=  {
        //     "userId": loggInUserDetails?.userId,
        //     "userName": loggInUserDetails?.loginId
        //   }
         requestBody.token = token
      

        let response = await axiosGet(
           'user/users', requestBody
        );
        if (response && response.status) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async function getRoleListService() {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        //let loggInUserDetails = getUserDetailsObj()
        // requestBody.dataAccessDTO=  {
        //     "userId": loggInUserDetails?.userId,
        //     "userName": loggInUserDetails?.loginId
        //   }
        requestBody.token = token
      

        let response = await axiosPost(
           'user/listAllRoles', requestBody
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

  async function createUpdateUserService(userDTO) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {...userDTO}
         let token = getJWTToken();
        // let loggInUserDetails = getUserDetailsObj()
        // requestBody.dataAccessDTO=  {
        //     "userId": loggInUserDetails?.userId,
        //     "userName": loggInUserDetails?.loginId
        //   }
         requestBody.token = token
      

        let response = await axiosPost(
           'user/saveOrUpdate', requestBody
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
  
  async function hardResetPasswordService(userId) {
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
        requestBody.userId = userId
      

        let response = await axiosPost(
           'user/hardResetPassword', requestBody
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
  async function getManagerList(roleId) {
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
        requestBody.roleMasterId = roleId
      

        let response = await axiosPost(
           'user/listManagerForRole', requestBody
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
  async function getInternalAuditorList() {
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
           'user/listAuditors', requestBody
        );
        if (response && response.status && response?.data?.responseObject ) {
          resolve(response.data.responseObject);
         
          
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  export {fetchUserListService, getRoleListService, createUpdateUserService, hardResetPasswordService, getManagerList, getInternalAuditorList}