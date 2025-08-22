import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get All Dealers with Details
export async function getAllDealersService() {
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

      const response = await axiosPost('/dealer/listAllDealers', requestBody);

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

// 2. Save or Update Dealer with Full Details
export async function saveOrUpdateDealerService(dealerDTO) {
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
        ...dealerDTO,
        //reportingToUserId: user?.userId 
      };

      const response = await axiosPost('/dealer/saveOrUpdateDealer', requestBody);

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


// Save Dealer Visit Log
export async function saveDealerVisitLogService(visitLogDTO) {
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
        salesmanId: user?.userId,
        ...visitLogDTO
      };

      const response = await axiosPost('/dealer/saveDealerVisitLog', requestBody);

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

// Get Dealer Visit Logs
export async function getDealerVisitLogsService({ salesmanId, dealerId, startDate, endDate }) {
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
        salesmanId: salesmanId || user?.userId || null,
        dealerId: dealerId || null,
        startDate: startDate || null,
        endDate: endDate || null
      };

      const response = await axiosPost('/dealer/getDealerVisitLogs', requestBody);

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


export async function getDealersByReportingUserService() {
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
        reportingToUserId: user?.userId  // optional
      };

      const response = await axiosPost('/dealer/getDealersByReportingUser', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data || { message: 'Failed to fetch dealers' });
      }

    } catch (error) {
      reject(error);
    }
  });
}