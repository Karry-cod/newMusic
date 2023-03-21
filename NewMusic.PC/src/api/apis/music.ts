import Request from "@/api/request"

export default new class Music {
    // 获取热门歌曲
    async getHotMusics(params?: any) {
        return await Request.get("search/hot", params);
    };
    // 获取相似歌曲，参数：keywords
    async getMusicInfo(params?: any) {
        return await Request.get("search", params);
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
        return await Request.get("lyric/new", params);
    };
    // 获取轮播图
    async getBanner(params?: any) {
        return await Request.get("banner", params);
    }
    // 获取热门搜索
    async getHotSearch() {
        return await Request.get("search/hot/detail");
    }
    // 获取相关搜索歌曲,mv，专辑，歌单
    async getSearch(params: any) {
        return await Request.get("search/suggest", params);
    }
    // 获取歌曲详情，参数：ids（','逗号隔开）
    async getSongDetails(params: any) {
        return await Request.get("song/detail", params);
    }
};