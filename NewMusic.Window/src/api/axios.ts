import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";


// 创建axios实例
const instance = axios.create({
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin-Type": '*'
    },
    timeout: 10000,
    withCredentials: false,
    baseURL: "http://localhost:3000/"
});


// 请求拦截
instance.interceptors.request.use((config: any) => {
    config.headers = {
        'Content-type': 'application/json'
    };
    config.data = true;
    return config;
}, error => {
    return Promise.reject(error.data.error.message);
})


// 响应拦截
instance.interceptors.response.use((res: AxiosResponse) => {
    return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res);
}, error => {
    return Promise.reject(error);
})

export default instance;