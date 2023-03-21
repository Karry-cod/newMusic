<template>
    <div class="body boxSide">
        <!-- 歌单信息 -->
        <div class="head">
            <div :style="{ 'background-image': 'url(' + artist.cover + ')' }"></div>
            <div>
                <div class="sheetName">{{ artist.name }}</div>
                <div>
                    <img src="@/assets/imgs/wangyiyun.png" alt="">
                    <!-- <span
                        style="font-size:0.2rem;margin-right: 30px;color:gray">网易云官方音乐</span> -->
                    <span v-for="item in artist.identifyTag" class="sheetTags">#{{ item }} </span>
                </div>
                <div class="sheetInfo">
                    <p>{{ artist.briefDesc }}</p>
                    <p style="margin-top: 1.5rem;">
                        <span>单曲音乐数：{{ artist.musicSize }}</span>
                        <span style="display: inline-block;margin-left: 20px;">专辑数：{{ artist.albumSize }}</span>
                        <span style="display: inline-block;margin-left: 20px;">MV数：{{ artist.mvSize }}</span>
                    </p>
                </div>
                <div class="sheet_btn">
                    <button>
                        <span style="transform: scale(1.4);display: inline-block;margin-right: 5px;">+</span>
                        <span style="margin-bottom: 5px;display:inline-block">关注</span>
                    </button>
                    <button @mouseenter="loveHover()" @mouseleave="loveLeave()" @click="loveSheet()">
                        <div class="img" :style="'background-image:url(' + love_img + ')'"></div>
                        <span style="margin-bottom: 5px;display:inline-block">歌手电台</span>
                    </button>
                    <div class="more"></div>
                </div>
            </div>
        </div>
        <!-- 歌曲 / 专辑等 - 列表 -->
        <div>
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="精选" name="concentration">
                </el-tab-pane>
                <el-tab-pane :label="'歌曲 ' + artist.musicSize" name="song">
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
                <el-tab-pane :label="'专辑 ' + artist.albumSize" name="album">
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
                <el-tab-pane :label="'视频 ' + artist.mvSize" name="video">
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
                <el-tab-pane label="详情" name="info">
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
import { ElMessage } from "element-plus";
import type { IMusic } from "@/utils/interfaces";
import Store from "@/utils/store"
import router from "@/router"

export default defineComponent({
    setup() {
        let data = reactive({
            love_img: "/src/assets/imgs/love.png",
            activeName: "song",
            showMusicTable: <IMusic[]>[],
            showAlbums: <any>[],
            showMVs: <any>[],
            showMore: true,
            aid: "",
            artist: <any>{
                mvs: [],
                albums: []
            }
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
            // 获取作者详情
            getArtistDetail() {
                let router = useRouter();
                let aid: any = router.currentRoute.value.params.aid;
                data.aid = aid;
                Artist.getDetail({ id: aid, limit: 999 }).then(res => {
                    if (res.code === 200) {
                        data.artist = res.data.artist;
                        events.getArtistSongs(aid);
                        events.getArtistAlbums(aid);
                        events.getArtistMVs(aid);
                        (document.getElementsByClassName("info")[0] as HTMLElement).innerText = data.artist.briefDesc;
                    }
                });
            },
            // 获取歌手的所有歌曲
            getArtistSongs(aid: string) {
                Artist.getArtistSongs({ id: aid }).then((res: any) => {
                    if (res.code === 200) {
                        data.artist.songs = res.songs.map((obj: any) => {
                            return <IMusic>{
                                mid: obj.id,
                                name: obj.name,
                                author: data.artist.name,
                                time: obj.dt,
                                album: obj.al.name,
                                musicImg: obj.al.picUrl,
                                backImg: obj.al.picUrl
                            };
                        });
                        data.showMusicTable = data.artist.songs.slice(0, 20);
                    }
                });
            },
            // 获取歌手的所有专辑
            getArtistAlbums(aid: string) {
                Artist.getArtistAlbums({ id: aid }).then((res: any) => {
                    if (res.code === 200) {
                        data.artist.albums = res.hotAlbums;
                        data.showAlbums = data.artist.albums.slice(0, 20);
                    }
                });
            },
            // 获取歌手的所有MV
            getArtistMVs(aid: string) {
                Artist.getArtistMVs({ id: aid, limit: 999 }).then((res: any) => {
                    if (res.code === 200) {
                        data.artist.mvs = res.mvs;
                        data.showMVs = data.artist.mvs.slice(0, 30);
                    }
                });
            }
        };

        onMounted(() => {
            events.getArtistDetail();
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
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    width: 0px;
                }
            }

            & .sheet_btn {
                position: absolute;
                bottom: 0px;

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

                &>button:nth-child(2) {
                    margin-left: 10px;
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
        width: 13%;
        min-width: 155px;
        height: 220px;
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