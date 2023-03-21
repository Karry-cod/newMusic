import Request from "@/api/request"
import { getCookie } from "@/utils/cookie";

export default new class Music {
    // 获取热门歌曲
    async getHotMusics(params?: any) {
        return await Request.get("search/hot", params);
    };
    // 获取单曲详情
    async getMusicInfo(params?: any) {
        return await Request.get("search", params);
    };
    async getSingleMusic(params?: any) {
        return await Request.get("music/url", params);
    };
    // 获取每日推荐歌曲（需要登录）
    async getRecommendMusic(params?: any) {
        return await Request.get("recommend/songs", params);
    };
    // 获取推荐新音乐
    async getRecommendNewMusic(params?: any) {
        return await Request.get("personalized/newsong", params);
    };
    // 获取音乐地址
    async getSongUrl(params?: any) {
        return await Request.get("song/url", params);
    };
    // 获取歌词
    async getSongWords(params?: any) {
        return await Request.get("lyric", params);
    };
    // 获取轮播图
    async getBanner(params?: any) {
        return await Request.get("banner", params);
    }
};