import Request from "@/api/request"

export default new class User {
    // 获取用户详情信息
    async getUserDetail(params: any) {
        return await Request.get("user/detail", params);
    }
    // 获取用户歌单
    async getUserPlayList(params: any) {
        return await Request.get("user/playlist", params);
    }
    // 获取喜欢的音乐
    async getLikeMusics(params: any) {
        return await Request.get("likelist", params);
    }
    // 获取用户动态
    async getUserEvents(params: any) {
        return await Request.get("user/event", params);
    }
    // 获取用户的关注列表
    async getUserFollows(params: any) {
        return await Request.get("user/follows", params);
    }
    // 获取用户的粉丝列表
    async getUserFollowers(params: any) {
        return await Request.get("user/followeds", params);
    }
}