import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// ✅ 1. Get All Product Categories
async function getProductCategoryListService() {
  return new Promise(async (resolve, reject) => {
    try {
      let requestBody = {};
      let token = getJWTToken();
      let loggedInUserDetails = getUserDetailsObj();

      requestBody.dataAccessDTO = {
        userId: loggedInUserDetails?.userId,
        userName: loggedInUserDetails?.loginId
      };
      requestBody.token = token;

      let response = await axiosPost("/product/listAllProductCategory", requestBody);

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

// ✅ 2. Save or Update Product Category
async function saveOrUpdateProductCategoryService(productCategoryDTO) {
  return new Promise(async (resolve, reject) => {
    try {
      let requestBody = {};
      let token = getJWTToken();
      let loggedInUserDetails = getUserDetailsObj();

      requestBody.dataAccessDTO = {
        userId: loggedInUserDetails?.userId,
        userName: loggedInUserDetails?.loginId
      };
      requestBody.token = token;

      // Pass the DTO properties
      requestBody.productCategoryId = productCategoryDTO.productCategoryId || 0;
      requestBody.productCategoryName = productCategoryDTO.productCategoryName;
      requestBody.description = productCategoryDTO.description;
      requestBody.activeFlag = productCategoryDTO.activeFlag || 'Y';
      requestBody.userId = loggedInUserDetails?.userId;

      let response = await axiosPost("/product/saveOrUpdateProductCategory", requestBody);

      if (response && response.status) {
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
  getProductCategoryListService, 
  saveOrUpdateProductCategoryService 
};
