import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";

async function getAuditBranchMapListService() {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        let response = await axiosPost(
          "audit/viewAuditBranchMap", requestBody
        );
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


  async function createUpdateAuditBranchMapService(branchAuditMapDto) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        requestBody.branchAuditMapDto =  branchAuditMapDto
        let response = await axiosPost(
           "audit/saveOrUpdateBranchAuditMap", requestBody
        );
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

  async function viewProjectsByProgramService(programId) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        requestBody.programId =  programId
        let response = await axiosPost(
           "audit/viewProjectsByProgram", requestBody
        );
        if (response && response.status && response.data.responseObject) {
          resolve(response.data.responseObject);
        } else {
          reject([]);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  export { createUpdateAuditBranchMapService, getAuditBranchMapListService, viewProjectsByProgramService }
  