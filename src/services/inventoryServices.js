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
