import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Save or Update GRN
export async function saveOrUpdateGRNService(grnDTO) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        },
        ...grnDTO,
        userId: user?.userId,
        createdBy: user?.userId,
      };

      const response = await axiosPost('/grn/saveOrUpdateGRN', requestBody);

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

// 2. Get GRNs by Filter (vendorId, poId, dateRange)
export async function getGRNsByFilterService( vendorId, poId, startDate, endDate ) {
  console.log( vendorId, poId, startDate, endDate)
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        },
        vendorId,
        poId,
        startDate,
        endDate,
      };

      const response = await axiosPost('/grn/getGRNsByFilter', requestBody);

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



export async function getGRNItemsService(grnId) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const response = await axiosPost(`/grn/getGRNItems`, {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        },
        grnId: grnId
      });

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


export async function getGRNsWithItemsByPOService(poId) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const response = await axiosPost(`/grn/getGRNsWithItemsByPO`, {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        },
        poId
      });

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
