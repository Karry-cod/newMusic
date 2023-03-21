import Request from "@/api/request"

export default new class MV {
    // 获取最新MV
    async getNewMV(params?: any) {
        return await Request.get("mv/first", params);
    }
    // 获取MV播放地址
    async getMVUrl(params: any) {
        return await Request.get("mv/url", params);
    }
    // 获取MV评论
    async getMVComment(params: any) {
        return await Request.get("comment/mv", params);
    }
    // 获取相关mv推荐视频
    async getRecommendMV(params: any) {
        return await Request.get("related/allvideo", params);
    }
    // 获取视频详情
    async getVideoDetail(params: any) {
        return await Request.get("video/detail", params);
    }
    // 获取视频地址
    async getVideoUrl(params: any) {
        return await Request.get("video/url", params);
    }
    // 获取视频评论
    async getVideoComment(params: any) {
        return await Request.get("comment/video", params);
    }
}