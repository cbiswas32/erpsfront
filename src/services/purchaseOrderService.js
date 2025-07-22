import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. List All POs
export async function listAllPOsService(startDate, endDate, vendorId ) {
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
        startDate, 
        endDate,
        vendorId
      };

      const response = await axiosPost('/po/listAllPOs', requestBody);

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

// 2. Save or Update PO
export async function saveOrUpdatePOService(poDTO) {
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
        ...poDTO,
        userId: user?.userId,
        createdBy:  user?.userId,
      };

      const response = await axiosPost('/po/saveOrUpdatePO', requestBody);

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

// 3. Get PO Summary (e.g., for dashboard/statistics)
export async function getPOSummaryService() {
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

      const response = await axiosPost('/po/getPOSummary', requestBody);

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


// 4. Get PO Items by PO ID
export async function getPOItemsByPOIdService(poId) {
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
        purchaseOrderId: poId // PO ID is passed to backend
      };

      const response = await axiosPost('/po/getPOItems', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject); // Return only PO items
      } else {
        reject(response?.data);
      }

    } catch (error) {
      reject(error);
    }
  });
}

