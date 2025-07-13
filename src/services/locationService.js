import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

//  1. Get All Locations
async function getAllLocationListService() {
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

      const response = await axiosPost("/location/locations", requestBody);

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

//  2. Save or Update Location
async function saveOrUpdateLocationService(locationDTO) {
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
        locationId: locationDTO.locationId || null,
        locationName: locationDTO.locationName,
        address: locationDTO.address,
        stateId: locationDTO.stateId,
        districtId: locationDTO.districtId,
        pincode: locationDTO.pincode,
        locationTypeIds: locationDTO.locationTypeIds || [],
        activeFlag: locationDTO.activeFlag || 'Y',
        userId: user?.userId
      };

      const response = await axiosPost("/location/saveOrUpdateLocation", requestBody);

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
  getAllLocationListService,
  saveOrUpdateLocationService
};
