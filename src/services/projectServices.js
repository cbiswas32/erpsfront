import { axiosPost, axiosGet } from './axios-config/requestClient';
import { getJWTToken, getUserDetailsObj } from "../utils/loginUtil";
async function getProgrammeList() {
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
          'program/listOfPrograms', requestBody
        );
        if (response && response.status) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
async function getActiveProjectList() {
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
        requestBody.projectActiveFlag=  'Y'
        let response = await axiosPost(
           'project/viewProject', requestBody
        );
        if (response && response.status) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
async function getPhasedOutProjectList() {
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
        requestBody.projectActiveFlag=  'PO'
        let response = await axiosPost(
           'project/viewProject', requestBody
        );
        if (response && response.status) {
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
async function getInActiveProjectList() {
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
          requestBody.projectActiveFlag=  'N'
          let response = await axiosPost(
             'project/viewProject', requestBody
          );
          if (response && response.status) {
            resolve(response.data.responseObject);
          } else {
            reject(response.data);
          }
        } catch (err) {
          reject(err);
        }
      });
  }
async function createUpdateProject(projectDetails) {
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
        requestBody.projectDto =  projectDetails
        let response = await axiosPost(
           'project/saveOrUpdate', requestBody
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

  async function approveProjects(projectIdList) {
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
        requestBody.projectDto ={
          'projectId' : projectIdList || []
        }  
        let response = await axiosPost(
           'project/approve', requestBody
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
  async function phaseOutProject(projId) {
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
        requestBody.projectDto ={
          'projectId' : projId
        }  
        let response = await axiosPost(
           'project/phaseout', requestBody
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

  export {getActiveProjectList, getPhasedOutProjectList, createUpdateProject, getInActiveProjectList, getProgrammeList, approveProjects, phaseOutProject}
  