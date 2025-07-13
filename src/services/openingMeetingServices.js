import { axiosPost, axiosGet } from "./axios-config/requestClient";
import { getJWTToken, getUserDetailsObj, getRole } from "../utils/loginUtil";


async function getOpeningMeetingQuestionsService() {
    return new Promise(async (resolve, reject) => {
      try {
        let requestBody = {}
        let token = getJWTToken();
        let loggInUserDetails = getUserDetailsObj()

       
        let url = 'planExcution/view'

       
       
       

       
      
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


  async function saveOpeningMeetingAnswerService (answers) {
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
        requestBody.plan_id =  10
        requestBody.responses =  answers
        let response = await axiosPost(
           "planExcution/saveQuestionnaireResponses", requestBody
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

  async function viewAllQuestionAnswerService () {
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
        requestBody.plan_id =  10
       
        let response = await axiosPost(
           "planExcution/viewResponses", requestBody
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

  

  export { getOpeningMeetingQuestionsService, saveOpeningMeetingAnswerService, viewAllQuestionAnswerService  }
  