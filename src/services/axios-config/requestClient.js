import axios from './axios';
export async function axiosPost(url,body){
    let response = await axios.post(url,body).catch(error => {
        throw error
    });
    return response;
}
export async function axiosGet(url){
    let response = await axios.get(url).catch(error => {
        throw error
    });
    return response;
}