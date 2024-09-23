

import axios from "axios";
import { baseUrl } from "../configs";



export const axiosInstance = axios.create({
    baseURL : baseUrl
})