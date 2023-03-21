import Request from "@/api/request"

export default new class MusicForm {
    // 获取精品歌单列表
    async getPlayList(params?: any) {
        return await Request.get("top/playlist/highquality", params);
    };
    // 获取每日推荐歌单
    async getRecommendSheet(params?: any) {
        return await Request.get("personalized", params);
    }
    // 获取歌单详情
    async getSheetInfo(params?: any) {
        return await Request.get("playlist/detail", params);
    }
    // 获取歌单内的所有歌曲
    async getSheetMusics(params?: any) {
        return await Request.get("playlist/track/all", params);
    }
    // 获取歌单评论
    async getSheetComment(params?: any) {
        return await Request.get("comment/playlist", params);
    }
    // 发表评论
    async sendComment(params?: any) {
        return await Request.get("comment", params);
    }
}