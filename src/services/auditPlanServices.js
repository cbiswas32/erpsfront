import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj, getRole } from "../utils/loginUtil";


async function getAuditPlanListService(activeFlag, role) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()

        // IA : 5, PD : 2, PM : 3, TL : 4, ADMIN: 1
        let role = getRole()
        console.log("Role", role)
        let url = 'plan/viewListOfPlansForPM'

        if(role?.roleMasterId === 3){
          url = 'plan/viewListOfPlansForPM'
          requestBody.activeFlag = activeFlag || "Y"
        }

        
        if(role?.roleMasterId === 4){
          url = 'plan/viewListOfPlansForTL'
          requestBody.userId =  loggInUserDetails?.userId
        }
       
        
        if(role?.roleMasterId === 5){
          url = 'plan/viewListOfPlansForIA'
          requestBody.userId =  loggInUserDetails?.userId
        }
       
       

       
      
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        
        let response = await axiosPost(
          url , requestBody
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

  async function getGeneralAuditPlanListService(activeFlag, role) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()

        // IA : 5, PD : 2, PM : 3, TL : 4, ADMIN: 1
        let role = getRole()
        console.log("Role", role)
        let url = 'plan/viewListOfPlansForPMGeneral'

        if(role?.roleMasterId === 3){
          url = 'plan/viewListOfPlansForPMGeneral'
          requestBody.activeFlag = activeFlag || "Y"
        }

        
        if(role?.roleMasterId === 4){
          url = 'plan/viewListOfPlansForTLGeneral'
          requestBody.userId =  loggInUserDetails?.userId
        }
       
        
        if(role?.roleMasterId === 5){
          url = 'plan/viewListOfPlansForIAGeneral'
          requestBody.userId =  loggInUserDetails?.userId
        }
       
       

       
      
        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        
        let response = await axiosPost(
          url , requestBody
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
  async function getAllHolidayList(year) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()

        // IA : 5, PD : 2, PM : 3, TL : 4, ADMIN: 1
       
        let url = 'holidays/holidaysForState'

        requestBody.dataAccessDTO=  {
            "userId": loggInUserDetails?.userId,
            "userName": loggInUserDetails?.loginId
          }
        requestBody.token = token
        requestBody.year = year
        
        let response = await axiosPost(
          url , requestBody
        );
       
        if (response && response.status && response.data.status) {
           console.log("response", response.data.responseObject)
          resolve(response.data.responseObject);
        } else {
          reject(response.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }



  async function createUpdateAuditPlanService(auditPlanDto) {
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
        requestBody.planDto =  auditPlanDto
        let response = await axiosPost(
           "plan/saveOredit", requestBody
        );
        console.log(response)
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

  async function tlReviewAuditPlanService(auditPlanDto) {
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
        requestBody.planDto =  auditPlanDto
        let response = await axiosPost(
           "plan/reviewAndedit", requestBody
        );
        console.log(response)
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
  async function approveRejectAuditPlanService(auditPlanID, activeFlag) {
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
        requestBody.planId =  auditPlanID
        requestBody.activeFlag =  activeFlag
        let response = await axiosPost(
           "plan/approveOrRejectPlan", requestBody
        );
        console.log(response)
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

  export { createUpdateAuditPlanService, getAuditPlanListService, tlReviewAuditPlanService, approveRejectAuditPlanService, getGeneralAuditPlanListService, getAllHolidayList }
  