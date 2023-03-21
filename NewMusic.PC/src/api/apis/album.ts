import Request from "@/api/request"

export default new class Album {
    // 获取专辑下的详情
    async getInfo(params: any) {
        return await Request.get("album", params);
    }
    // 获取专辑的评论
    async getComment(params: any) {
        return await Request.get("comment/album", params);
    }
}