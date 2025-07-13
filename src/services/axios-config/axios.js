import axios from 'axios';
import {domainUrl} from './domain';

const instance = axios.create({
    baseURL:domainUrl,
    timeout: 30000,
    timeoutErrorMessage: "TIMEOUT"
});

export default instance