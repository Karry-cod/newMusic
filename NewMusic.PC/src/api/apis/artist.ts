import Request from "@/api/request"

export default new class Artist {
    // 获取作者详情
    async getDetail(params: any) {
        return await Request.get("artist/detail", params);
    }
    // 获取歌手的所有歌曲
    async getArtistSongs(params: any) {
        return await Request.get("artist/songs", params);
    }
    // 获取歌手的所有专辑
    async getArtistAlbums(params: any) {
        return await Request.get("artist/album", params);
    }
    // 获取歌手的所有mv
    async getArtistMVs(params: any) {
        return await Request.get("artist/mv", params);
    }
}