import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";
async function getDistrictListService() {
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
          "location/listAllDistricts", requestBody
        );
        if (response && response.status && response.data.status) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async function getDistrictListByStateIdService(stateId) {
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
        requestBody.stateId =  stateId
        let response = await axiosPost(
           "district/viewDistrictsByState", requestBody
        );
        if (response && response.status) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async function saveOrUpdateDistrictService(districtDTO) {
  return new Promise(async (resolve, reject) => {
    try {
      let requestBody = {};
      let token = getJWTToken();
      let loggInUserDetails = getUserDetailsObj();

      requestBody.dataAccessDTO = {
        userId: loggInUserDetails?.userId,
        userName: loggInUserDetails?.loginId
      };
      requestBody.token = token;
      
      // Include districtDTO fields
      requestBody.districtId = districtDTO.districtId || 0;
      requestBody.stateId = districtDTO.stateId;
      requestBody.districtName = districtDTO.districtName;

      let response = await axiosPost("/location/saveOrUpdateDistrict", requestBody);

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

  export {getDistrictListService, getDistrictListByStateIdService, saveOrUpdateDistrictService}
  