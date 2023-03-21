import Request from "@/api/request"

export default new class DJ {
    // 查看电台的节目列表
    async getDJPrograms(params: any) {
        return await Request.get("dj/program", params);
    }
}