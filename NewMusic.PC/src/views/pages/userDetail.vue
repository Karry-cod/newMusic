<template>
    <div class="body boxSide">
        <!-- 用户信息 -->
        <div class="head">
            <div :style="{ 'background-image': 'url(' + user.avatarUrl + ')' }"></div>
            <div>
                <div class="sheetName">{{ user.nickname }}</div>
                <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.2);padding-bottom: 6px;position: relative;">
                    <span
                        style="background-color: darkolivegreen;color:white;display: inline-block;border-radius: 10px;padding: 7px;padding-top:0px;padding-bottom:0px;font-size: 0.8rem;">Lv.{{
                            user.level }}</span>
                    <span v-if="user.gender === 1" class="sex">
                        <svg t="1678349017680" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="6599" width="20" height="20">
                            <path
                                d="M872.335 421.516V151.71H602.528L702.949 252.13 601.4 353.68c-46.47-32.81-103.174-52.091-164.385-52.091-157.595 0-285.351 127.756-285.351 285.35S279.421 872.29 437.014 872.29s285.352-127.755 285.352-285.35c0-57.78-17.19-111.537-46.711-156.47l102.818-102.814 93.862 93.861zM437.015 782.18c-107.827 0-195.24-87.413-195.24-195.24s87.413-195.24 195.24-195.24 195.24 87.413 195.24 195.24-87.413 195.24-195.24 195.24z"
                                fill="#1296DB" p-id="6600"></path>
                        </svg>
                    </span>
                    <span v-if="user.gender === 0" class="sex">
                        <svg t="1678349229841" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="9561" width="20" height="20">
                            <path
                                d="M877.714286 365.714286C877.714286 163.7504 713.963886 0 512 0S146.285714 163.7504 146.285714 365.714286c0 183.285029 134.999771 334.6432 310.857143 361.142857L457.142857 804.571429l-164.571429 0 0 109.714286 164.571429 0 0 109.714286 109.714286 0 0-109.714286 164.571429 0 0-109.714286-164.571429 0 0-77.714286C742.714514 700.357486 877.714286 548.999314 877.714286 365.714286zM256 365.714286c0-141.143771 114.856229-256 256-256s256 114.856229 256 256-114.856229 256-256 256S256 506.858057 256 365.714286z"
                                fill="#d4237a" p-id="9562"></path>
                        </svg></span>
                    <!-- 关注 - 发私信 - 更多 按钮区 -->
                    <div class="sheet_btn">
                        <button @mouseenter="loveHover()" @mouseleave="loveLeave()" @click="loveSheet()">
                            <div class="img" :style="'background-image:url(' + love_img + ')'"></div>
                            <span style="margin-bottom: 5px;display:inline-block">发私信</span>
                        </button>
                        <button>
                            <span style="transform: scale(1.4);display: inline-block;margin-right: 5px;">+</span>
                            <span style="margin-bottom: 5px;display:inline-block">关注</span>
                        </button>
                        <div class="more"></div>
                    </div>
                </div>
                <!-- 用户信息 -->
                <div class="sheetInfo">
                    <div @click="router.push('/userEvent/' + user.userId)">
                        <p>{{ user.eventCount }}</p>
                        <p>动态</p>
                    </div>
                    <div @click="router.push('/userFollow/' + user.userId)">
                        <p>{{ user.follows }}</p>
                        <p>关注</p>
                    </div>
                    <div @click="router.push('/userFollowers/' + user.userId)" style="border-right: 0px;">
                        <p>{{ user.followeds }}</p>
                        <p>粉丝</p>
                    </div>
                </div>
                <div style="padding-top: 5px;">
                    <p v-if="user.bindings?.length === 0"><span style="color:gray">社交网络：</span>未绑定</p>
                    <p><span style="color:gray">个人介绍：</span>{{ user.signature || '暂无介绍' }}</p>
                </div>
            </div>
        </div>
        <!-- 创建歌单 / 收藏歌单 / 创建的博客 / 收藏的博客 / 创建的音乐栏 -->
        <div style="margin-top: 20px;">
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="创建的歌单" name="createList">
                    <div class="tab">
                        <div class="album_outside" @click="router.push('/musicSheet/' + item.id)" v-for="item in showSheets"
                            :key="item.id">
                            <div class="img" :style="'background-image:url(' + item.coverImgUrl + ')'">
                                <div class="player"></div>
                            </div>
                            <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ item.name }}</p>
                            <p style="font-size: 0.8rem;color:gray">{{ item.trackCount }}首</p>
                        </div>
                        <div class="showMore">
                            <span v-if="showSheets?.length < user.createSheets?.length" style="cursor: pointer;"
                                @click="showMoreInfo('sheet')">加载更多</span>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="收藏的歌单" name="loveList">
                    <div class="tab">
                        <el-table @cell-dblclick="playSong" :data="showMusicTable" row-style="border:0px"
                            highlight-current-row="true" row-class-name="table_tr" style="width: 100%">
                            <el-table-column prop="name" label="歌曲" />
                            <el-table-column width="150">
                                <template #default="scope">
                                    <div class="musicBtns">
                                        <div @click="playSong(scope.row)"></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="album" label="专辑" />
                            <el-table-column label="时长" width="100">
                                <template #default="scope">
                                    <span>
                                        {{ repairZero(parseInt((scope.row.time / 60000 - 1).toFixed(0))) }}:
                                        {{ repairZero(parseInt((scope.row.time / 1000 % 60).toFixed(0))) }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="showMore">
                            <span v-if="showMore" style="cursor: pointer;" @click="showMoreInfo('music')">加载更多</span>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="创建的博客" name="createBlog">
                    <div class="tab">
                        <div class="album_outside" @click="toAlbum(item.id)" v-for="item in showAlbums" :key="item.id">
                            <div class="img" :style="'background-image:url(' + item.picUrl + ')'">
                                <div class="player"></div>
                            </div>
                            <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ item.name }}</p>
                            <p style="font-size: 0.8rem;color:gray">{{ formatDate(item.publishTime) }}</p>
                        </div>
                        <div class="showMore">
                            <span v-if="showAlbums?.length < artist.albums?.length" style="cursor: pointer;"
                                @click="showMoreInfo('album')">加载更多</span>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="收藏的博客" name="loveBlog">
                    <div class="tab">
                        <div class="mv_outside" @click="router.push('/mv/' + item.id)" v-for="item in showMVs">
                            <div class="backImg" :style="'background-image:url(' + item.imgurl + ')'">
                                <div class="player"></div>
                            </div>
                            <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ item.name }}</p>
                        </div>
                        <div class="showMore">
                            <span v-if="showMVs?.length < artist.mvs?.length" style="cursor: pointer;"
                                @click="showMoreInfo('mv')">加载更多</span>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="创建的音乐栏" name="createSheet">
                    <div class="tab info"></div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watchEffect } from "vue"
import { useRouter } from "vue-router"
import Artist from "@/api/apis/artist"
import Music from "@/api/apis/music"
import User from "@/api/apis/user"
import { ElMessage } from "element-plus";
import type { IMusic } from "@/utils/interfaces";
import Store from "@/utils/store"
import router from "@/router"

export default defineComponent({
    setup() {
        let data = reactive({
            love_img: "/src/assets/imgs/love.png",
            activeName: "createList",
            showMusicTable: <IMusic[]>[],
            showAlbums: <any>[],
            showSheets: <any>[],
            showMVs: <any>[],
            showMore: true,
            aid: "",
            artist: <any>{
                mvs: [],
                albums: []
            },
            user: <any>{}
        });

        let methods = {
            // 鼠标滑入收藏按钮
            loveHover() {
                data.love_img = "/src/assets/imgs/love_light.png";
            },
            // 鼠标滑出收藏按钮
            loveLeave() {
                data.love_img = "/src/assets/imgs/love.png";
            },
            // 收藏歌单
            loveSheet() {
                ElMessage.warning("请先登录！！");
            },
            // 补零
            repairZero(num: number) {
                if (num < 10) {
                    return "0" + num;
                } else {
                    return num;
                }
            },
            // 时间戳转换
            formatDate(date: number) {
                let time = new Date(date);
                return time.getFullYear() + "-" + this.repairZero((time.getMonth() + 1)) + "-" + this.repairZero(time.getDate());
            },
            // 查看更多信息
            showMoreInfo(type: string) {
                switch (type) {
                    case "music":
                        data.showMusicTable = data.artist.songs.slice(0, data.showMusicTable.length + 10);
                        break;
                    case "album":
                        data.showAlbums = data.artist.albums.slice(0, data.showAlbums.length + 20);
                        break;
                    case "mv":
                        data.showMVs = data.artist.mvs.slice(0, data.showMVs.length + 30);
                        break;
                }
            },
            // 双击单元格
            playSong(song: IMusic) {
                if (song.musicImg == undefined) {
                    Music.getSongDetails({ ids: song.mid }).then((res: any) => {
                        if (res.code === 200) {
                            song.musicImg = res.songs[0].al.picUrl;
                            song.backImg = res.songs[0].al.picUrl;
                            Store.player.playSong(song);
                        }
                    });
                } else {
                    Store.player.playSong(song);
                }
            },
            // 播放全部音乐，即添加进听歌列表
            playAllSong() {
                let mark = true;
                let newArr = Store.player.waitSongs;
                data.artist.songs.forEach((item: any) => {
                    if (!newArr.find(d => d.mid == item.mid)) {
                        newArr.push(item);
                    }
                    if (item.mid == Store.player.currentSong.mid) {
                        mark = false;
                    }
                });
                Store.player.waitSongs = newArr;
                if (mark) {
                    Store.player.playSong(data.artist.songs[0]);
                }
            },
            // 查看专辑详情
            toAlbum(id: string) {
                router.push('/album/' + id)
            }
        };

        let events = {
            // 获取用户详情信息
            getUserDetail() {
                let router = useRouter();
                let uid: any = router.currentRoute.value.params.uid;
                User.getUserDetail({ uid }).then((res: any) => {
                    if (res.code === 200) {
                        data.user = res.profile;
                        data.user.level = res.level;
                        data.user.bindings = res.bindings;
                        events.getUserPlayList(uid);
                    }
                });
            },
            // 获取用户歌单
            getUserPlayList(uid: string) {
                User.getUserPlayList({ uid, limit: 999 }).then((res: any) => {
                    if (res.code === 200) {
                        data.user.createSheets = res.playlist;
                        data.showSheets = data.user.createSheets.slice(0, 20);
                        data.showSheets[0].id = uid;
                    }
                });
            }
        };

        onMounted(() => {
            events.getUserDetail();
        });

        watchEffect(() => {
            if (data.showMusicTable.length >= data.artist.songs?.length) {
                data.showMore = false;
            }
        })

        return {
            ...toRefs(data),
            ...methods,
            Store,
            router
        };
    }
})

</script>

<style lang="scss" scoped>
.body {
    width: 83%;
    padding-top: 10px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: 0 auto;

    & .head {
        display: flex;
        width: 100%;
        height: 190px;

        &>div:nth-child(1) {
            width: 13%;
            min-width: 190px;
            height: 100%;
            border-radius: 50%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }

        &>div:nth-child(2) {
            width: 100%;
            height: 100%;
            padding-left: 15px;
            position: relative;

            & .sheetName {
                font-weight: 600;
                line-height: 2rem;
                font-size: 1.5rem;
            }

            & .sheetTags {
                color: gray;
                cursor: pointer;
                padding-right: 10px;
                font-size: 0.1rem;

                &:hover {
                    color: lightgreen;
                }
            }

            & img {
                width: 30px;
                height: 30px;
                transform: translateY(10px);
                margin-right: 5px;
            }

            & .sheetInfo {
                font-size: 12px;
                margin-top: 10px;
                max-height: 70px;
                width: 100%;
                display: flex;

                & div {
                    width: 100px;
                    border-right: 1px solid rgba(143, 140, 140, 0.5);
                    padding: 8px;
                    text-align: center;
                    cursor: pointer;
                    transition: 0.2s;

                    &:hover {
                        &>p:nth-child(1) {
                            color: green;
                        }
                    }

                    &>p:nth-child(1) {
                        font-size: 1.3rem;
                        font-weight: 600;
                    }

                    &>p:nth-child(2) {
                        color: gray;
                    }
                }
            }

            & .sheet_btn {
                position: absolute;
                right: 0px;
                top: -15px;

                &>button {
                    display: inline-block;
                    height: 2rem;
                    border: 0px;
                    background-color: rgba(5, 150, 105);
                    color: white;
                    border-radius: 30px;
                    width: 9rem;
                    cursor: pointer;
                    font-size: 1rem;

                    &:hover {
                        background-color: rgba(4, 120, 87);
                    }
                }

                &>button:nth-child(1) {
                    margin-right: 10px;
                    background-color: white;
                    color: black;
                    border: 1px solid rgb(160, 157, 157, 0.4);

                    &>.img {
                        width: 80px;
                        width: 20px;
                        height: 20px;
                        background-size: cover;
                        background-position: center;
                        display: inline-block;
                        margin-right: 5px;
                        transform: translateY(5px);
                    }

                    &:hover {
                        color: rgb(105, 251, 115);
                        border: 1px solid rgb(105, 251, 115);
                    }
                }

                & .more {
                    display: inline-block;
                    width: 2rem;
                    cursor: pointer;
                    height: 2rem;
                    margin-left: 10px;
                    transform: translateY(10px);
                    background-image: url('@/assets/imgs/more.png');
                    background-size: cover;

                    &:hover {
                        background-image: url('@/assets/imgs/more_light.png');
                    }
                }
            }
        }
    }

    & .album_outside {
        display: inline-block;
        width: 23%;
        min-width: 155px;
        height: 250px;
        transition: 0.3s;
        margin-right: 15px;
        margin-top: 10px;
        border-radius: 10px;

        & .img {
            width: 100%;
            height: 80%;
            border-radius: 10px;
            position: relative;
            transition: 0.3s;
            overflow: hidden;
            cursor: pointer;
            background-size: cover;

            & .player {
                width: 35px;
                height: 35px;
                display: none;
                background-image: url('@/assets/imgs/play1.png');
                background-position: center;
                background-size: cover;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);

                &:hover {
                    background-image: url('@/assets/imgs/play2.png');
                }
            }

            &::before {
                content: "";
                position: absolute;
                top: 0px;
                left: 0px;
                background-color: rgba(0, 0, 0, 0.6);
                transition: 0.3s;
                opacity: 0;
                width: 100%;
                height: 100%;
            }

            &:hover {
                transform: translateY(-7px);

                & .player {
                    display: block;
                }

                &::before {
                    opacity: 1;
                }
            }
        }
    }

    & .mv_outside {
        display: inline-block;
        width: 24%;
        margin-right: 10px;
        margin-top: 10px;
        height: 220px;

        & .backImg {
            width: 100%;
            height: 90%;
            background-size: cover;
            border-radius: 10px;
            cursor: pointer;
            overflow: hidden;
            transition: 0.3s;
            position: relative;

            & .player {
                width: 35px;
                height: 35px;
                display: none;
                background-image: url('@/assets/imgs/play1.png');
                background-position: center;
                background-size: cover;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);

                &:hover {
                    background-image: url('@/assets/imgs/play2.png');
                }
            }

            &:before {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                transition: 0.3s;
                background-color: rgba(0, 0, 0, 0.6);
                opacity: 0;
            }

            &:hover {
                transform: translateY(-7px);

                &:before {
                    opacity: 1;
                }

                & .player {
                    display: block;
                }
            }
        }
    }
}

.sex {
    display: inline-block;
    transform: translateY(5px);
    margin-left: 5px;
}

@media screen and (width < 1500px) {
    .album_outside {
        height: 160px !important;
    }

    .mv_outside {
        width: 45% !important;
    }
}

.musicBtns {
    opacity: 0;
    display: flex;

    &>div {
        width: 20px;
        height: 20px;
        cursor: pointer;
        background-size: cover;
        background-position: center;
        margin-left: 10px;
    }

    &>div:nth-child(1) {
        background-image: url('@/assets/imgs/sheet_play.png');

        &:hover {
            background-image: url('@/assets/imgs/sheet_play_light.png');
        }
    }

    &>div:nth-child(2) {
        background-image: url('@/assets/imgs/add.png');

        &:hover {
            background-image: url('@/assets/imgs/add_light.png');
        }
    }

    &>div:nth-child(3) {
        background-image: url('@/assets/imgs/download.png');

        &:hover {
            background-image: url('@/assets/imgs/download_light.png');
        }
    }

    &>div:nth-child(4) {
        background-image: url('@/assets/imgs/more.png');

        &:hover {
            background-image: url('@/assets/imgs/more_light.png');
        }
    }

}

// Element-plus ， 样式更改
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;

    & .tab {
        animation: tabs 0.2s ease-out alternate;

        & .showMore {
            text-align: center;
            color: rgb(109, 236, 109);
            font-size: 1rem;
            padding-top: 20px;
            transition: 0.2s;
            letter-spacing: 2px;

            &:hover {
                color: green;
            }
        }
    }
}

@keyframes tabs {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }

    100% {
        transform: translateX(0px);
        opacity: 1;
    }
}

:deep(.el-tabs__item:hover) {
    color: #34d399;
}

:deep(.is-active) {
    color: #34d399;
}

:deep(.el-tabs__active-bar) {
    background-color: #34d399;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
    border: 0px;
}

:deep(.el-table) {
    & tr:hover {
        & .musicBtns {
            opacity: 1;
        }
    }
}

:deep(.el-table__body tr.current-row > td) {
    background-color: rgb(236, 257, 246) !important;
}

:deep(.el-textarea) {
    --el-input-focus-border-color: lightgreen;
}
</style>