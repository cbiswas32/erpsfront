// src/services/bomServices.js
import { axiosPost } from './axios-config/requestClient';
import { getJWTToken, getUserDetailsObj } from '../utils/loginUtil';

export async function getBOMByProductIdService(productId) {
  const token = getJWTToken();
  const user = getUserDetailsObj();
  const body = {
    token,
    dataAccessDTO: { userId: user.userId, userName: user.loginId },
    productId
  };
  const res = await axiosPost('/product/getBOMDetails', body);
  return res?.data?.responseObject || [];
}

export async function saveOrUpdateBOMService(bomDTO) {
  const token = getJWTToken();
  const user = getUserDetailsObj();
  const body = {
    token,
    dataAccessDTO: { userId: user.userId, userName: user.loginId },
    ...bomDTO
  };
  const res = await axiosPost('/product/saveOrUpdateBOM', body);
  return res?.data;
}
