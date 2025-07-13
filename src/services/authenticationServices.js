import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";
async function logInService(logInDetails) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = logInDetails
    
        let response = await axiosPost(
           'auth/login', requestBody
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

  async function changePasswordService(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = req
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        if (!token) {
          throw new Error("Authentication failed: No token found");
        }
        
        requestBody.token = token;
        requestBody.userId = loggInUserDetails?.userId

        requestBody.dataAccessDTO =  {
              "userId": loggInUserDetails?.userId,
              "userName": loggInUserDetails?.loginId
            }
        let response = await axiosPost(
           'user/changePassword', requestBody
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
  async function resetPasswordByAdminService(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let token = getJWTToken();
        
        let requestBody = {}
        requestBody.userId =  userId
        requestBody.token = token;
        let response = await axiosPost(
           'auth/resetPasswordAdmin', requestBody
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
  async function resetPasswordService(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = req
        let response = await axiosPost(
           'auth/initialResetPassword', requestBody
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
  
  

  export {logInService, changePasswordService, resetPasswordService, resetPasswordByAdminService}