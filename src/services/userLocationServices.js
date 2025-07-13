import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get all users with their location mappings
async function getUserLocationMappingsService() {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId
        },
        token
      };

      const response = await axiosPost("/location/userLocationMaps", requestBody);

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

// 2. Save or Update user-location mapping
async function saveOrUpdateUserLocationMappingService({userId, locationIds}) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId
        },
        token,
        userId: userId,
        locationIds: locationIds,
        assignedBy: user?.userId
      };

      const response = await axiosPost("/location/saveOrUpdateUserLocationMap", requestBody);

      if (response && response.status && response.data.status) {
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
  getUserLocationMappingsService,
  saveOrUpdateUserLocationMappingService
};
