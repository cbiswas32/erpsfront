import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// ✅ 1. Get All Location Types
async function getLocationTypeListService() {
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

      let response = await axiosPost("/location/listAllLocationTypes", requestBody);

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

// ✅ 2. Save or Update Location Type
async function saveOrUpdateLocationTypeService(locationTypeDTO) {
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

      // Pass the DTO properties
      requestBody.locationTypeId = locationTypeDTO.locationTypeId || 0;
      requestBody.locationTypeName = locationTypeDTO.locationTypeName;
      requestBody.description = locationTypeDTO.description;
      requestBody.activeFlag = locationTypeDTO.activeFlag || 'Y';
      requestBody.userId = loggInUserDetails?.userId;

      let response = await axiosPost("/location/saveOrUpdateLocationType", requestBody);

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

export { 
  getLocationTypeListService, 
  saveOrUpdateLocationTypeService 
};
