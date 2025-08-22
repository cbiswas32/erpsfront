import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";


// Get Today's User Time Spent List
export async function listTodayUsersTimeService() {
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

      const response = await axiosPost('/dashboard/listTodayUsersTime', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data || { message: "Failed to fetch today's user time list" });
      }
    } catch (error) { 
      reject(error);
    }
  });
}



// Get Daily Total Time (last 7 days) for a user
export async function getUserDailyTotalTimeService(userId) {
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
        userId: userId 
      };

      const response = await axiosPost('/dashboard/getUserDailyTotalTime', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data || { message: "Failed to fetch user daily total time" });
      }
    } catch (error) {
     
      reject(error);
    }
  });
}


export async function fetchProductsSoldReportService(period = "today") {
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
        period 
      };

      const response = await axiosPost("/dashboard/fetchProductsSoldReport", requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data || { message: "Failed to fetch products sold report" });
      }
    } catch (error) {
      reject(error);
    }
  });
}


// Get inactive salesmen list
export async function listInactiveSalesmenService(periodDays = 1) {
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
        periodDays
      };

      const response = await axiosPost("/dashboard/listInactiveSalesmen", requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data || { message: "Failed to fetch inactive salesmen list" });
      }
    } catch (error) {
      reject(error);
    }
  });
}


// Get Dashboard Summary
export async function getDashboardSummaryService() {
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

      const response = await axiosPost('/dashboard/getDashboardSummary', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data.responseObject);
      } else {
        reject(response?.data || { message: "Failed to fetch dashboard summary" });
      }
    } catch (error) {
      reject(error);
    }
  });
}
