<template>
    <div class="headerBox">
        <!-- 导航条 -->
        <div class="routeBar">
            <img src="@/assets/imgs/routeBar1.png" class="routeBars" alt="" @click="back()" />
            <img src="@/assets/imgs/routeBar1.png" class="routeBars" alt="" @click="next()" />
        </div>
        <!-- 搜索框 -->
        <div class="searchBox">
            <div :class="inputClass">
                <el-icon size="17px" color="gray" style="margin-top: 5px;">
                    <Search />
                </el-icon>
                <input type="text" @focus="focusText()" @blur="blurText()" class="searchText" placeholder="搜索音乐，MV，歌单"
                    v-model="searcher.content" />
                <!-- 搜索内容 -->
                <div class="searchContent" v-show="searcher.isShow">
                    <!-- 热门搜索 -->
                    <div class="contentType" v-if="searcher.content.length == 0">
                        <p class="title">热门搜索</p>
                        <p class="content hotSearch" @click="toHotSearch(item.searchWord)"
                            v-for="(item, index) in searcher.hotSearch" :key="item.searchWord">
                            <span>{{ index + 1 }}.{{ item.searchWord }}</span>
                            <span style="float:right;color:orangered;font-weight: 600;">{{ item.score > 10000 ? (item.score
                                /
                                10000).toFixed(1) + ' 万' : item.score }}</span>
                        </p>
                    </div>
                    <template v-if="searcher.content.length > 0">
                        <!-- 单曲 -->
                        <div class="contentType" v-if="searcher.songs.length > 0">
                            <p class="title">单曲</p>
                            <p class="content search" @click.stop="playSong(item.id)" v-for="(item) in searcher.songs"
                                :key="item.id">
                                <span style="color:#34d399">{{ item.name }} </span>
                                -
                                <span> {{ item.artists[0].name }}</span>
                            </p>
                        </div>
                        <!-- 歌手 -->
                        <div class="contentType" v-if="searcher.authors.length > 0">
                            <p class="title">歌手</p>
                            <p class="content search" v-for="item in searcher.authors"
                                @click="router.push('/artist/' + item.id)" :key="item.id" style="color:#34d399">
                                <img :src="item.picUrl" alt="" />&nbsp;&nbsp;&nbsp;
                                <span style="position:relative;bottom: 5px;">{{ item.name }}</span>
                            </p>
                        </div>
                        <!-- 专辑 -->
                        <div class="contentType" v-if="searcher.albums.length > 0">
                            <p class="title">专辑</p>
                            <p class="content search" @click="router.push('/album/' + item.id)"
                                v-for="item in searcher.albums" :key="item.id">
                                <span style="color:#34d399">{{ item.name }} </span>
                                -
                                <span> {{ item.artist.name }}</span>
                            </p>
                        </div>
                        <!-- 歌单 -->
                        <div class="contentType" v-if="searcher.playlist.length > 0">
                            <p class="title">歌单</p>
                            <p class="content search" @click="router.push('/musicSheet/' + item.id)" style="color:#34d399"
                                v-for="item in searcher.playlist" :key="item.id">
                                <img :src="item.coverImgUrl" alt="" />&nbsp;&nbsp;&nbsp;
                                <span style="position:relative;bottom: 5px;">{{ item.name }}</span>
                            </p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <!-- 功能区 -->
        <div class="toolSpace">
            <div class="headImg" @click="login()">
                <div style="display:flex" class="img">
                    <div :style="'background-image:url(' + loginUser.headImg + ')'" class="dimg"></div>
                    <span v-if="!loginUser.isLogin" style="display: block;padding-top: 8px;padding-left: 5px;">立即登录</span>
                    <!-- 点击头像登录 -->
                    <div class="imgTool" v-if="loginUser.isLogin">
                        <p>{{ loginUser.name }}</p>
                        <div>注销</div>
                        <div @click="changeUser()">切换账户</div>
                    </div>
                </div>
                <div @mouseenter="enterIcon('chat')" @mouseleave="leaveIcon('chat')"
                    style="margin-left:20px;padding-top:7px;cursor: pointer;">
                    <el-icon size="23px" :color="icon_chatColor">
                        <ChatDotRound></ChatDotRound>
                    </el-icon>
                </div>
                <div @mouseenter="enterIcon('setting')" @mouseleave="leaveIcon('setting')"
                    style="margin-left:10px;padding-top:7px;cursor: pointer;">
                    <el-icon size="23px" :color="icon_settingColor">
                        <Setting></Setting>
                    </el-icon>
                </div>
            </div>
        </div>
        <!-- 遮罩层 -->
        <div class="floor" v-if="showDialog">
            <!-- 登录区 -->
            <div class="login_floor">
                <!-- 二维码 -->
                <div class="login_ewm">
                    <p>请使用移动端平台<span style="color:#34d399">扫码</span>登录</p>
                    <div class="ewm">
                        <img :src="loginUser.ewm" style="width:100%;height:100%" alt="">
                    </div>
                </div>
                <!-- 登录框 -->
                <div class="login_account">
                    <div class="account_outBox">
                        <img src="@/assets/imgs/wangyiyun_logo.png" class="login_logo" alt="" />
                        <!-- 电话 -->
                        <div>
                            <div style="width:100%;height:20px;overflow:hidden">
                                <span
                                    :style="{ color: 'red', float: 'right', transition: '0.2s', transform: !codeBtn.rightPhone ? 'translateY(0px)' : 'translateY(20px)' }">*
                                    手机号错误</span>
                            </div>
                            <el-input v-model="loginUser.account" maxlength="11" size="large" placeholder="请输入手机号"
                                class="input-with-select">
                                <template #prepend>
                                    <el-select size="large" v-model="phoneIP.country" placeholder="Select"
                                        style="width: 115px;background-color:white">
                                        <el-option v-for="item in phoneIP.countries" :key="item.id"
                                            :label="item.name + ' &nbsp;&nbsp;+' + item.number" :value="item.id">
                                            <span style="float: left">{{ item.name }}</span>
                                            <span
                                                style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">+{{
                                                    item.number
                                                }}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-input>
                        </div>
                        <!-- 密码 -->
                        <div v-show="showPwd">
                            <el-input show-password="true" size="large" v-model="loginUser.password" placeholder="请输入密码"
                                class="input-with-select">
                                <template #prepend>
                                    <el-button :icon="Key" size="large"
                                        style="background-color:white;border-left: 1px solid rgb(224,226,233);border-bottom: 1px solid rgb(224,226,233);" />
                                </template>
                            </el-input>
                        </div>
                        <div v-show="!showPwd">
                            <el-input v-model="loginUser.code" placeholder="请输入验证码" size="large">
                                <template #append>
                                    <el-button @click="sendCode()" type="default" :disabled="codeBtn.disabled">{{
                                        codeBtn.text
                                    }}</el-button>
                                </template>
                            </el-input>
                        </div>
                        <div>
                            <el-checkbox label="自动登录" size="large" />
                            <div v-show="showPwd" style="float:right;display: flex;padding-top: 6px;color:rgb(75, 75, 223)">
                                <div class="login_tool">忘记密码</div>
                                <div style="padding-left:10px;padding-right:10px;color:black">|</div>
                                <div class="login_tool" @click="showPwd = false">验证码登录</div>
                            </div>
                            <div v-show="!showPwd"
                                style="float:right;display: flex;padding-top: 6px;color:rgb(75, 75, 223)">
                                <div class="login_tool" @click="showPwd = true">密码登录</div>
                            </div>
                        </div>
                        <!-- 登录 / 注册 -->
                        <div style="text-align:center">
                            <el-button type="danger" @click="toLogin()" size="danger" class="login_btn">登录</el-button>
                            <a style="text-decoration: underline;cursor:pointer">注册</a>
                        </div>
                        <div style="display:flex;margin-top: 20px;">
                            <div class="logo"></div>
                            <div class="logo"></div>
                            <div class="logo"></div>
                            <div class="logo"></div>
                        </div>
                        <div style="margin-top: 20px;font-size: 14px;" class="policy">
                            <div style="width:100%;height:20px;overflow:hidden">
                                <span
                                    :style="{ color: 'red', float: 'left', transition: '0.2s', transform: !codeBtn.policyTip ? 'translateY(0px)' : 'translateY(20px)' }">*
                                    请同意政策要求！</span>
                            </div>
                            <el-checkbox v-model="codeBtn.checkPolicy" /> 请同意《<a>服务条款</a>》《<a>隐私政策</a>》《<a>儿童隐私政策</a>》
                        </div>
                    </div>
                </div>
                <!-- 退出按钮 -->
                <div class="btn_close" @click="closeFloor()" @mouseenter="enterIcon('close')"
                    @mouseleave="leaveIcon('close')">
                    <el-icon size="23px" :color="icon_closeColor">
                        <Close></Close>
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, watchEffect } from "vue"
import { Search, ChatDotRound, Setting, Key, Close } from '@element-plus/icons-vue'
import type { IUser, IMusic } from "@/utils/interfaces";
import Login from "@/api/apis/login";
import Music from "@/api/apis/music"
import { setCookie, getCookie } from "@/utils/cookie";
import { ElMessage } from "element-plus";
import router from "@/router"
import Store from "@/utils/store";

// 数据源
let data = reactive({
    inputClass: "xu-input",
    icon_chatColor: "black",
    icon_settingColor: "black",
    icon_closeColor: "gray",
    showDialog: false,
    loginUser: <IUser>{
        uid: "",
        ewm: "",
        account: "",
        password: "",
        isLogin: false,
        headImg: "https://img2.baidu.com/it/u=236287310,808853450&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1674061200&t=dd14ce092bc847f53623d711e791e3a2",
        cookie: "",
        code: ""
    },
    ewmLoading: <any>{
        lock: false,
        text: ""
    }, //二维码loding
    phoneIP: {
        country: 1,
        countries: [{
            id: 1,
            icon: '',
            name: '中国',
            number: 86
        }, {
            id: 2,
            icon: '',
            name: '英国',
            number: 186
        }]
    },
    showPwd: true,
    codeBtn: {
        text: "请发送验证码",
        disabled: false,
        rightPhone: true,
        checkPolicy: false,
        policyTip: true
    },
    // 搜索框
    searcher: {
        isShow: false,
        content: "",
        hotSearch: <any>[],
        songs: <any>[],
        playlist: <any>[],
        authors: <any>[],
        albums: <any>[]
    }
});

// 方法集
let { focusText, blurText, enterIcon, leaveIcon, changeUser, login, sendCode, toLogin, closeFloor, back, next, playSong, toHotSearch } = {
    // 文本框聚焦
    focusText() {
        (document.getElementsByClassName("searchContent")[0] as HTMLElement).style.opacity = "1";
        data.inputClass = "xu-input focus";
        data.searcher.isShow = true;
    },
    // 文本框失焦
    blurText() {
        (document.getElementsByClassName("searchContent")[0] as HTMLElement).style.opacity = "0";
        data.inputClass = "xu-input";
        setTimeout(() => {
            data.searcher.isShow = false;
        }, 300);
    },
    // 滑入图标
    enterIcon(icon: string) {
        switch (icon) {
            case "chat":
                data.icon_chatColor = "rgb(48, 211, 174)";
                break;
            case "setting":
                data.icon_settingColor = "rgb(48, 211, 174)";
                break;
            case "close":
                data.icon_closeColor = "black";
                break;
        }
    },
    // 滑出图标
    leaveIcon(icon: string) {
        switch (icon) {
            case "chat":
                data.icon_chatColor = "black";
                break;
            case "setting":
                data.icon_settingColor = "black";
                break;
            case "close":
                data.icon_closeColor = "gray";
                break;
        }
    },
    // 切换账户
    changeUser() {
        data.showDialog = true;
        let key = "";
        Login.getEwmKey({ timerstamp: new Date().getTime() }).then((res: any) => {
            if (res.code === 200) {
                key = res.data.unikey;
                Login.getEwmImg({ key, qrimg: 1 }).then((res2: any) => {
                    if (res2.code === 200) {
                        data.loginUser.ewm = res2.data.qrimg;
                        let user = {
                            name: "",
                            headImg: "",
                            uid: ""
                        };
                        let listen = setInterval(() => {
                            const t2 = new Date().getTime()
                            Login.listenEwmStatus({ key, timerstamp: t2 }).then((result: any) => {
                                if (result.code === 803) {
                                    let cookie = encodeURIComponent(result.cookie);
                                    setCookie("cookie", result.cookie);
                                    clearInterval(listen);
                                    events.getRecommendMusic(cookie);
                                    Login.getLoginStatus({ timerstamp: Date.now(), cookie }).then(res => {
                                        if (res.data.code === 200) {
                                            data.loginUser.uid = res.data.account.id;
                                            data.loginUser.isLogin = true;
                                            data.showDialog = false;
                                            data.loginUser.headImg = user.headImg;
                                            data.loginUser.name = user.name;
                                            setCookie("user", data.loginUser);
                                            setTimeout(() => {
                                                location.reload();
                                            }, 100);
                                        }
                                    });
                                } else if (result.code === 802) {
                                    user.name = result.nickname;
                                    user.headImg = result.avatarUrl;
                                    data.ewmLoading = {
                                        lock: true,
                                        text: "请确认登录"
                                    };
                                }
                            });
                        }, 1500);
                    }
                });
            }
        });
    },
    // 登录
    login() {
        if (!data.loginUser.isLogin) {
            changeUser();
        }
    },
    // 发送验证码
    sendCode() {
        if (!data.codeBtn.checkPolicy) {
            data.codeBtn.policyTip = false;
            return;
        }
        if (data.loginUser.account.length != 11) {
            data.codeBtn.rightPhone = false;
            return;
        }
        Login.sendCode({ phone: data.loginUser.account }).then(() => {
            let num = 60;
            data.codeBtn.disabled = true;
            let timer = setInterval(() => {
                num--;
                data.codeBtn.text = num + "秒后再发送";
                if (num === 0) {
                    clearInterval(timer);
                    data.codeBtn.disabled = false;
                    data.codeBtn.text = "发送验证码";
                }
            }, 1000);
        });
    },
    // 手机号登录
    toLogin() {
        if (!data.codeBtn.checkPolicy) {
            data.codeBtn.policyTip = false;
            return;
        }
        if (data.loginUser.account.length != 11) {
            data.codeBtn.rightPhone = false;
            return;
        }
        if (data.codeBtn.rightPhone && data.codeBtn.policyTip) {
            ElMessage.warning("暂时还不支持手机号登录，请使用二维码登录，谢谢！");
        }
    },
    // 关闭遮罩层
    closeFloor() {
        data.showDialog = false;
    },
    // 跳转上一路由
    back() {
        router.back();
    },
    // 跳转下一路由
    next() {
        // router.next();
    },
    // 点击单曲播放歌曲
    playSong(id: string) {
        Music.getSongDetails({ ids: id }).then((res: any) => {
            if (res.code === 200) {
                let obj = res.songs[0];
                let song = <IMusic>{
                    mid: id,
                    name: obj.name,
                    author: obj.ar[0].name,
                    time: obj.dt,
                    album: obj.al.name,
                    musicImg: obj.al.picUrl,
                    backImg: obj.al.picUrl
                };
                Store.player.playSong(song);
            }
        });
    },
    // 点击热门搜索，输入库聚焦
    toHotSearch(word: string) {
        data.searcher.content = word;
        // (document.getElementsByClassName("searchText")[0] as HTMLElement).focus()
        setTimeout(() => {
            (document.getElementsByClassName("searchText")[0] as HTMLElement).focus()
        }, 300);
    }
};

// 私有方法.不暴露
let events = {
    // 监听手机号
    watchPhone: () => {
        let format = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/; // 手机号正则
        if (data.loginUser.account.length != 11) {
            data.codeBtn.rightPhone = true;
            let numFormat = /^\d*$/;
            if (!numFormat.test(data.loginUser.account)) {
                data.loginUser.account = data.loginUser.account.substring(0, data.loginUser.account.length - 1);
            }
        } else {
            let numFormat = /^\d*$/;
            if (!numFormat.test(data.loginUser.account)) {
                data.loginUser.account = data.loginUser.account.substring(0, data.loginUser.account.length - 1);
            }
            else if (!format.test(data.loginUser.account)) {
                data.codeBtn.rightPhone = false;
            }
        }
    },
    // 监听是否同意政策
    watchPolicy: () => {
        if (data.codeBtn.checkPolicy) {
            data.codeBtn.policyTip = true;
        }
    },
    // 登录之后获取每日推荐歌曲
    getRecommendMusic: (cookie: string) => {
        Music.getRecommendMusic({ cookie }).then((res) => {
        });
    },
    // 获取热门搜索建议
    getHotSearch: () => {
        Music.getHotSearch().then(res => {
            if (res.code === 200) {
                data.searcher.hotSearch = res.data;
            }
        });
    },
    // 监听搜索框内容的变化
    watchSearchContent() {
        Music.getSearch({ keywords: data.searcher.content }).then((res) => {
            if (res.code === 200) {
                data.searcher.songs = res.result.songs ?? [];
                data.searcher.playlist = res.result.playlists ?? [];
                data.searcher.albums = res.result.albums ?? [];
                data.searcher.authors = res.result.artists ?? [];
            }
        });
    }
};

let { inputClass, icon_chatColor, icon_settingColor, showDialog, loginUser, icon_closeColor, phoneIP, showPwd, codeBtn, searcher } = toRefs(data);

onMounted(() => {
    let user = getCookie("user");
    if (user) {
        (data.loginUser as any) = JSON.parse(user);
    };
    events.getHotSearch();
})

watchEffect(() => {
    events.watchPhone();
    events.watchPolicy();
    events.watchSearchContent();
})

</script>

<style lang="scss" scoped>
.headerBox {
    width: 100%;
    height: 100%;
    padding: 20px;
    padding-left: 40px;
    padding-right: 40px;
    display: flex;

    .routeBar {
        width: 5%;
        min-width: 50px;
        height: 100%;

        .routeBars {
            width: 15px;
            height: 15px;
            margin-top: 7px;
            cursor: pointer;


            &:nth-child(1) {
                transform: rotate(180deg);
            }

            &:nth-child(2) {
                margin-left: 25%;
            }
        }
    }

    .searchBox {
        width: 20%;
        background-color: white;

        .xu-input {
            width: 80%;
            min-width: 180px;
            height: 100%;
            border-radius: 20px;
            border: 1px solid rgb(164, 168, 172);
            display: flex;
            // overflow: hidden;
            padding-left: 10px;
            background-color: rgb(241, 245, 249);
            transition: 0.3s;
            position: relative;

            .searchText {
                width: 100%;
                height: 100%;
                border-radius: 20px;
                font-size: 12px;
                border: 0px;
                background-color: rgb(241, 245, 249);
                outline: none;
                margin-left: 3px;
            }

            .searchContent {
                position: absolute;
                top: 150%;
                left: -10%;
                max-height: 340px;
                overflow-y: scroll;
                width: 120%;
                border-radius: 2px;
                transition: 0.3s;
                box-shadow: 0px 0px 5px 1px rgb(150, 148, 148, 0.5);
                background-color: white;
                z-index: 9999;
                display: block;
                padding-bottom: 5px;
                animation: searchcontent 0.3s alternate;

                &::-webkit-scrollbar {
                    display: none;
                }

                & .contentType {
                    margin-top: 3px;

                    & .title {
                        font-size: 1rem;
                        line-height: 30px;
                        padding-left: 5px;
                        color: gray;
                    }

                    & .content {
                        font-size: 0.6rem;
                        transition: 0.2s;
                        padding-left: 10px;
                        padding-right: 10px;
                        line-height: 30px;
                        cursor: pointer;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        & img {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            transform: translateY(15%);
                        }
                    }

                    & .hotSearch:hover {
                        &>span:nth-child(1) {
                            color: #34d399;
                        }
                    }

                    & .search:hover {
                        background-color: rgba(0, 0, 0, 0.1);
                    }
                }
            }
        }

        .focus {
            border: 1px solid rgb(48, 211, 174);
        }
    }

    .toolSpace {
        width: 100%;
        position: relative;

        .headImg {
            position: absolute;
            right: 0px;
            display: flex;
            z-index: 9999;

            & .dimg {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-size: 40px 40px;
            }

            & .img {
                cursor: pointer;
                font-size: 13px;
                transition: 0.3s;
                position: relative;
                display: block;
                opacity: 0.8;

                &:hover {
                    color: rgb(48, 211, 174);
                    opacity: 1;
                    height: 150px;

                    & .imgTool {
                        opacity: 1;
                        display: block;
                    }
                }

                & .imgTool {
                    opacity: 0;
                    display: none;
                    transition: 0.3s;
                    min-width: 180px;
                    z-index: 9999;
                    padding: 5px;
                    background-color: white;
                    box-shadow: 0px 0px 5px 1px gray;
                    border-radius: 5px;
                    position: absolute;
                    top: 40%;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    transform: translateX(-40%);
                    color: black;
                    text-align: center;
                    cursor: default;

                    & p {
                        font-size: 16px;
                        font-weight: 600;
                    }

                    & div {
                        color: gray;
                        padding-top: 5px;
                    }

                    & div:hover {
                        transition: 0.2s;
                        cursor: pointer;
                        color: rgb(48, 211, 174);
                        background-color: rgb(233, 227, 227);
                    }

                    &::before {
                        position: absolute;
                        content: "";
                        width: 0px;
                        height: 0px;
                        border-bottom: 12px solid white;
                        border-right: 12px solid transparent;
                        border-left: 12px solid transparent;
                        filter: drop-shadow(0px -6px 5px gray);
                        top: -10%;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }

            }
        }
    }
}

.floor {
    position: fixed;
    z-index: 99999;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    background-color: rgb(0, 0, 0, 0.4);
    top: 0px;
    left: 0px;
    animation: floor 0.3s alternate;

    & .login_floor {
        width: 900px;
        min-height: 450px;
        padding: 10px;
        background-color: white;
        // position: absolute;
        margin: 0 auto;
        top: 20%;
        display: flex;

        & .login_ewm {
            width: 80%;

            & p {
                text-align: center;
                font-size: 20px;
                margin-top: 50px;
                // color:gray
                letter-spacing: 1px;
            }

            & .ewm {
                width: 200px;
                height: 200px;
                transform: translateY(30px);
                margin: 0 auto;
            }
        }

        & .login_account {
            width: 100%;
            border-left: 1px solid rgb(180, 175, 175, 0.4);

            & .account_outBox {
                width: 70%;
                margin: 0 auto;
            }

            & .login_logo {
                width: 50%;
                margin-left: 50%;
                height: 50px;
                padding-top: 10px;
                margin-bottom: 30px;
                transform: scaleY(4) translateX(-50%);
            }

            & .login_tool:hover {
                transition: 0.2s;
                cursor: pointer;
                color: rgb(90, 90, 235);
            }

            & .login_btn {
                width: 100%;
                height: 45px;
                margin-top: 20px;
                margin-bottom: 10px;
                background-color: rgb(255, 58, 58);
                font-size: 17px;
                letter-spacing: 5px;
            }

            & a:hover {
                color: blue;
            }

            & .logo {
                width: 25%;
                height: 50px;
                background-size: 40px 40px;
                background-position: center;
                background-repeat: no-repeat;
                cursor: pointer;
                background-image: url('@/assets/imgs/qq.png');
            }

            & .logo:nth-child(2) {
                background-image: url('@/assets/imgs/wechat.png');
            }

            & .logo:nth-child(3) {
                background-image: url('@/assets/imgs/xinlang.png');
            }

            & .logo:nth-child(4) {
                background-image: url('@/assets/imgs/wangyiyun.png');
            }

            & .policy>a {
                color: rgb(75, 75, 223);
                cursor: pointer;
            }
        }

        & .btn_close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
    }
}

@keyframes floor {
    0% {
        width: 0px;
        height: 0px;
    }

    100% {
        width: 100vw;
        height: 100vh;
    }
}

@keyframes searchcontent {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}
</style>