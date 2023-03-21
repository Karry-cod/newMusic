import request from "@/api/axios"
import type { IResponse } from "@/utils/interfaces";

export default new class Request {
    get(url: string, params?: any): Promise<IResponse> {
        return request({
            url,
            method: "get",
            params
        })
    };
    post(url: string, data: any): Promise<IResponse> {
        return request({
            url,
            method: "post",
            data
        });
    };
}