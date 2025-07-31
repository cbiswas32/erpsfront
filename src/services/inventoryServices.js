import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get All Inventory
export async function getAllInventoryService() {
  return new Promise(async (resolve, reject) => {
    try {
      const token = getJWTToken();
      const user = getUserDetailsObj();

      const requestBody = {
        token,
        dataAccessDTO: {
          userId: user?.userId,
          userName: user?.loginId,
        }
      };

      const response = await axiosPost('/inventory/getAllInventory', requestBody);

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


// Adjust Inventory
export async function adjustInventoryService(adjustments = []) {
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
        userId: user?.userId,
          adjustments // array of { productId, locationId, quantityChange, reason, adjustmentDate }
        
      };

      const response = await axiosPost('/inventory/adjustInventory', requestBody);

      if (response?.status && response?.data?.status) {
        resolve(response.data);
      } else {
        reject(response?.data);
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Get Adjustment History by Filters
export async function getInventoryAdjustmentsByFilterService(filters = {}) {
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
        
          ...filters // { startDate, endDate, productId? }
        
      };

      const response = await axiosPost('/inventory/getInventoryAdjustmentsByFilter', requestBody);

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



export async function createInventoryIssueService({issueData = {}, issueItems = []}) {
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
        
          issueData,   // { issue_date, location_id, issued_to, remarks }
          issueItems,   // [ { product_id, quantity_issued }, ... ]
          userId: user?.userId,
        
      };

      const response = await axiosPost('/inventory/createInventoryIssue', requestBody);

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

// 2. Get All Inventory Issues (with optional date filters)
export async function getAllInventoryIssuesService(startDate = null, endDate = null) {
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
        
      };

      if (startDate) requestBody.startDate = startDate;
      if (endDate) requestBody.endDate = endDate;

      const response = await axiosPost('/inventory/getAllInventoryIssues', requestBody);

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

// Get product serials by productId and optional status
export async function getProductSerialsService({ productId, status = null }) {
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
        
          productId,
          ...(status ? { status } : {})
        
      };

      const response = await axiosPost('/inventory/getProductSerials', requestBody);

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