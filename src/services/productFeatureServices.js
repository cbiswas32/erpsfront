import { axiosPost } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

// 1. Get All Product Features
export async function getAllProductFeaturesService() {
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

      const response = await axiosPost('/product/listAllProductFeatures', requestBody);
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

// 2. Save or Update Product Feature
export async function saveOrUpdateProductFeatureService(featureDTO) {
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
        featureId: featureDTO.productFeatureId || 0,
        featureName: featureDTO.featureName,
        description: featureDTO.description,
        unit: featureDTO.unit,
        activeFlag: featureDTO.activeFlag ?? 'Y',
        userId: user?.userId
      };

      const response = await axiosPost('/product/saveOrUpdateProductFeature', requestBody);
      if (response?.status) {
        resolve(response.data);
      } else {
        reject(response?.data);
      }
    } catch (error) {
      reject(error);
    }
  });
}
