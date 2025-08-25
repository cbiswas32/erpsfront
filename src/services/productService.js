// src/services/productService.js
import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get All Products
export async function getAllProductsService() {
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

      const response = await axiosPost('/product/listAllProducts', requestBody);
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

// 2. Save or Update Product (with Features)
export async function saveOrUpdateProductService(productDTO) {
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
        ...productDTO,
        userId: user?.userId
      };

      const response = await axiosPost('/product/saveOrUpdateProductController', requestBody);

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

// 3. Get Product Features By Product ID
export async function getProductFeaturesByProductIdService(productId) {
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
        productId
      };

      const response = await axiosPost('/product/getProductFeaturesByProductId', requestBody);
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


// 4. Update Product Status (Activate / Deactivate)
export async function updateProductStatusService(productId, isActive) {
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
        productId,
        isActive, // true = active, false = inactive
        userId: user?.userId
      };

      const response = await axiosPost('/product/updateProductStatus', requestBody);

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