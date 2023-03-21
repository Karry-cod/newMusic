import Request from "@/api/request"

export default new class MV {
    // 获取最新MV
    async getNewMV(params?: any) {
        return await Request.get("mv/first", params);
    }
}