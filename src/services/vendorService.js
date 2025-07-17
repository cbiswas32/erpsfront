import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get All Vendors with Details
export async function getAllVendorsService() {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId
        }
      };

      const response = await axiosPost('/vendor/listAllVendors', requestBody);
      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data);
      }

    } catch (error) {
      reject(error);
    }
  });
}

// 2. Save or Update Vendor with Full Details
export async function saveOrUpdateVendorService(vendorDTO) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId
        },
        ...vendorDTO,
        userId: user?.userId
      };

      const response = await axiosPost('/vendor/saveOrUpdateVendor', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data);
      }

    } catch (error) {
      reject(error);
    }
  });
}
