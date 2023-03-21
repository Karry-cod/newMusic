import Request from "@/api/request"

export default new class Login {
    // 获取登录二维码的key
    async getEwmKey(params?: any) {
        return await Request.get("login/qr/key", params);
    };
    // 根据key生成二维码
    async getEwmImg(params: any) {
        return await Request.get("login/qr/create", params);
    };
    // 二维码检测扫码状态接口
    async listenEwmStatus(params: any) {
        return await Request.get("login/qr/check", params);
    };
    // 发送验证码
    async sendCode(params: any) {
        return await Request.get("captcha/sent", params);
    };
    // 刷新登录状态
    async refreshState() {
        return await Request.get("login/refresh");
    }
    // 获取用户歌单
    async getUserSheets(params: any) {
        return await Request.get("user/playlist", params);
    }
    // 获取登录状态
    async getLoginStatus(params: any) {
        return await Request.get(`login/status`, params);
    }
}