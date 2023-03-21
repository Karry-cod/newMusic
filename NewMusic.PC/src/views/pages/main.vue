<template>
    <div class="body boxSide">
        <!-- 推荐 -->
        <div>
            <h1>推荐</h1>
            <div class="recommend" @mousemove="mousemove" @mouseup="delDrap()" @mousedown="initX()" ref="swipe">
                <div :id="item.mid" class="recommendMusic" @click="Store.player.playSong(item)"
                    :style="'background-image:url(' + item.backImg + ')'" v-for="item in recommend"></div>
            </div>
        </div>
        <!-- 你的专属歌单 -->
        <div>
            <h2>你的专属歌单 ></h2>
            <div class="songSheet">
                <div class="sheetBox" @click="toSheet(item.msid)" @mouseout="outSheet(item)" @mouseenter="enterSheet(item)"
                    v-for="item in sheet" :id="item.msid">
                    <div class="img" :style="'background-image:url(' + item.sheetImg + ')'"></div>
                    <div class="sheetListener">
                        <el-icon size="12px" style="transform:translateY(2px)">
                            <Service />
                        </el-icon>
                        {{
                            item.listener > 10000 ? (item.listener / 10000) > 100 ? (item.listener /
                                10000).toString().substring(0, 3) + '万' : (item.listener / 10000).toString().substring(0, 4) +
                        '万' :
                            item.listener
                        }}
                    </div>
                    <div class="sheetInfo">
                        <p>
                            {{ item.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推荐新音乐 -->
        <div>
            <h2>推荐新音乐 ></h2>
            <div class="newMusic">
                <div class="newMusics" @click="Store.player.playSong(item)" v-for="item in newMusic">
                    <img :src="item.musicImg" alt="">
                    <div>
                        <p class="name">{{ item.name }}</p>
                        <p class="author">{{ item.author }}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推荐MV -->
        <div>
            <h2>推荐MV ></h2>
            <div class="MV_Box">
                <div class="point" @click="changeMv(1)"></div>
                <div class="MV">
                    <div class="MV_outside" :style="'transform:translateX(-' + translate + '%)'">
                        <div class="MVS" @click="router.push('/mv/' + item.mvid)" v-for="item in mv" :id="item.mvid"
                            :style="'background-image:url(' + item.backImg + ')'">
                            <div class="player"></div>
                            <div class="mv_listener">
                                <el-icon style="width:17px;height:17px;transform:translate(-1px , 1px) scale(1.3)">
                                    <VideoCamera />
                                </el-icon>
                                {{ item.listener }}
                            </div>
                            <div class="mv_introduce">
                                <p class="mv_name">{{ item.name }}</p>
                                <p class="mv_author">{{ item.author }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="point" style="transform:rotate(180deg)" @click="changeMv(2)"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted } from "vue";
import router from "@/router/index.js"
import type { IMusic, IMusicSheet, IMV } from "@/utils/interfaces.js";
import { Service, VideoCamera } from '@element-plus/icons-vue';
import Music from "@/api/apis/music";
import MV from "@/api/apis/mv";
import MusicForm from "@/api/apis/musicForm"
import { ElMessage } from "element-plus";
import Store from "@/utils/store"
import { getCookie } from "@/utils/cookie"

export default defineComponent({
    emits: ['playSong'],
    setup() {
        let data = reactive({
            recommend: <IMusic[]>[],
            sheet: <IMusicSheet[]>[],
            newMusic: <IMusic[]>[],
            mv: <IMV[]>[],
            mouse: {
                clientX: 0,
                pageX: 0,
                isDown: false,
                diffX: 0,
                width: 0
            },
            translate: 0,
            currentMusic: <IMusic>{}
        })

        const refs = {
            swipe: ref(null)
        };


        const methods = {
            // 控制推荐栏的播听量
            enterSheet(sheet: IMusicSheet) {
                let index = data.sheet.findIndex(d => d.msid == sheet.msid);
                (document.getElementsByClassName("sheetListener")[index] as HTMLElement).style.opacity = "0";
            },
            outSheet(sheet: IMusicSheet) {
                let index = data.sheet.findIndex(d => d.msid == sheet.msid);
                (document.getElementsByClassName("sheetListener")[index] as HTMLElement).style.opacity = "1";
            },
            // 控制推荐栏的横移
            initX() {
                var event: any = event || window.event;
                data.mouse.clientX = event.clientX;
                data.mouse.isDown = true;
            },
            delDrap() {
                data.mouse.isDown = false;
                data.mouse.diffX += data.mouse.pageX - data.mouse.clientX;
                let dom: any = refs.swipe.value;
                if (data.mouse.diffX > 0) {
                    data.mouse = {
                        clientX: 0,
                        pageX: 0,
                        isDown: false,
                        diffX: 0,
                        width: 0
                    };
                    dom.querySelectorAll(".recommendMusic").forEach((item: any) => {
                        item.style.transform = `translateX(0px)`;
                    });
                }
                if (data.mouse.diffX < data.mouse.width * -1) {
                    dom.querySelectorAll(".recommendMusic").forEach((item: any) => {
                        item.style.transform = `translateX(${data.mouse.diffX - (data.mouse.diffX + data.mouse.width)}px)`;
                    });
                    data.mouse.diffX -= data.mouse.diffX + data.mouse.width;
                }
            },
            mousemove(e: any) {
                if (data.mouse.isDown) {
                    let dom: any = refs.swipe.value;
                    let diffX = e.pageX - data.mouse.clientX;
                    data.mouse.pageX = e.pageX;
                    let width = 0;
                    dom.querySelectorAll(".recommendMusic").forEach((item: any, index: number) => {
                        item.style.transform = `translateX(${diffX + data.mouse.diffX}px)`;
                        let info = item.getBoundingClientRect();
                        index > 3 ? width += info.width + 20 : null;
                    });
                    data.mouse.width = width + 20 * 3 - 20;
                }
            },
            // 切换mv列表
            changeMv(num: number) {
                switch (num) {
                    case 1:
                        data.translate = 50.5;
                        break;
                    case 2:
                        data.translate = 0;
                        break;
                }
            },
            // 跳转歌单页面
            toSheet(msid: string) {
                router.push("musicSheet/" + msid);
            }
        };

        const events = {
            // 获取热门歌曲
            getHotMusic() {
                let musics = <any>[];
                Music.getHotMusics().then(res => {
                    if (res.code === 200) {
                        res.result.hots.forEach((item: any) => {
                            Music.getMusicInfo({ keywords: item.first, limit: 1 }).then((music: any) => {
                                let obj = music.result.songs[0];
                                musics.push(
                                    {
                                        mid: obj.id,
                                        name: obj.name,
                                        musicImg: obj.artists[0].img1v1Url,
                                        backImg: obj.artists[0].img1v1Url,
                                        information: "",
                                        author: obj.artists[0].name,
                                        source: "",
                                        time: 0
                                    }
                                );
                                if (musics.length == 10) {
                                    data.newMusic = musics;
                                }
                            });
                        });
                    }
                }).catch(err => {
                    console.log(err, "/search/hot：Error");
                    ElMessage.error(err.message);
                });
            },
            // 获取推荐歌单列表
            async getPlayList() {
                await MusicForm.getRecommendSheet({ limit: 10 }).then((res: any) => {
                    if (res.code === 200) {
                        res.result.forEach((item: any, index: number) => {
                            data.sheet[index] = {
                                msid: item.id,
                                musics: [],
                                information: item.description,
                                sheetImg: item.picUrl,
                                listener: item.playCount,
                                name: item.name
                            };
                        });
                    }
                });
            },
            // 获取最新MV
            async getNewMV() {
                await MV.getNewMV({ limit: 6 }).then((res: any) => {
                    if (res.code === 200) {
                        res.data.forEach((item: any, index: number) => {
                            data.mv[index] = {
                                mvid: item.id,
                                name: item.name,
                                author: item.artistName,
                                backImg: item.cover,
                                information: "",
                                listener: item.playCount,
                                publishTime: "",
                                source: ""
                            };
                        });
                    }
                });
            },
            // 获取推荐新音乐
            async getNewMusic() {
                await Music.getRecommendNewMusic().then((res) => {
                    if (res.code === 200) {
                        res.result.forEach((item: any, index: number) => {
                            data.newMusic[index] = {
                                mid: item.id,
                                musicImg: item.picUrl,
                                name: item.name,
                                backImg: item.picUrl,
                                information: "",
                                author: item.song.album.artists[0].name,
                                source: "",
                                mv: "",
                                words: [],
                                time: 0
                            };
                        })
                    }
                })
            },
            // 获取轮播图
            async getBanner() {
                await Music.getBanner().then((res: any) => {
                    if (res.code === 200) {
                        res.banners.forEach((item: any, index: number) => {
                            data.recommend[index] = {
                                mid: item.targetId,
                                name: item.typeTitle,
                                musicImg: item.imageUrl,
                                backImg: item.imageUrl,
                                information: "",
                                author: "",
                                source: "",
                                mv: "",
                                words: [],
                                time: 0
                            };
                        });
                    }
                });
            }
        };

        onMounted(() => {
            events.getPlayList();
            events.getNewMV();
            events.getNewMusic();
            events.getBanner();
        })

        return {
            ...toRefs(data),
            ...toRefs(refs),
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

    .recommend {
        display: flex;
        width: 100%;
        height: 200px;
        overflow-x: scroll;
        padding-top: 20px;

        .recommendMusic {
            height: 100%;
            min-width: 320px;
            margin-left: 20px;
            border-radius: 20px;
            background-size: 100% 100%;
            cursor: pointer;
            overflow: hidden;

            &::before {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                transition: 0.3s;
                background-color: white;
                opacity: 0;
            }

            &:hover {
                &::before {
                    opacity: 0.2;
                }
            }
        }

        &::-webkit-scrollbar {
            width: 0px;
        }
    }

    .songSheet {
        width: 100%;
        height: 180px;
        display: flex;
        overflow-x: scroll;
        padding-top: 10px;

        &::-webkit-scrollbar {
            width: 0px;
        }

        .sheetBox {
            min-width: 130px;
            height: 100%;
            border-radius: 20px;
            margin-left: 18px;
            background-size: cover;
            background-position: center;
            position: relative;

            & .img {
                width: 100%;
                height: 130px;
                background-size: cover;
                border-radius: 15px;
                cursor: pointer;
                transition: 0.3s;
                overflow: hidden;
                position: relative;

                &::before {
                    position: absolute;
                    content: "";
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    transition: 0.3s;
                    opacity: 0;
                }

                &::after {
                    position: absolute;
                    content: "";
                    background-image: url("@/assets/imgs/play1.png");
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 50%;
                    height: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                    transition: 0.3s;
                    background-position: center;
                }

                &:hover {
                    transform: translateX(-3px) translateY(-3px);

                    &::before {
                        opacity: 1;
                    }

                    &::after {
                        opacity: 1;
                        background-image: url("@/assets/imgs/play2.png");
                    }
                }
            }

            & .sheetListener {
                background-color: rgb(12, 5, 5, 0.8);
                position: absolute;
                bottom: 24px;
                padding: 1px;
                padding-left: 6px;
                padding-right: 6px;
                font-size: 0.75rem;
                letter-spacing: 1px;
                border-radius: 10px;
                right: 10px;
                color: white;
                transition: 0.2s;
            }

            & .sheetInfo {
                font-size: 0.1rem;

                & p {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }

    .newMusic {
        width: 100%;
        padding-top: 15px;
        padding-bottom: 15px;

        & .newMusics {
            width: 20%;
            display: inline-block;
            height: 50px;
            position: relative;
            cursor: pointer;
            transition: 0.3s;

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }

            & img {
                width: 50px;
                height: 100%;
                border-radius: 4px;
            }

            & div {
                display: inline-block;
                position: absolute;
                margin-left: 10px;
                width: 75%;

                & .name {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 13px;
                }

                & .author {
                    color: gray;
                    font-size: 12px;
                    line-height: 30px;
                }
            }
        }
    }

    .MV_Box {
        display: flex;

        &:hover {
            & .point {
                opacity: 1;
            }
        }

        & .point {
            width: 20px;
            height: 100px;
            margin-top: 100px;
            transition: 0.2s;
            opacity: 0;
            background-image: url('@/assets/imgs/pointLeft.png');
            background-size: 20px 100px;
            background-position: center;
            background-repeat: no-repeat;
            cursor: pointer;

            &:hover {
                background-image: url('@/assets/imgs/pointLeft_light.png');
            }
        }
    }

    .MV {
        width: 100%;
        overflow: hidden;
        padding-top: 15px;
        padding-bottom: 100px;

        & .MV_outside {
            width: 200%;
            transition: 0.3s;
            display: flex;

            & .MVS {
                width: 30%;
                height: 300px;
                border-radius: 10px;
                background-size: cover;
                background-position: center;
                margin-left: 2%;
                position: relative;
                transition: 0.3s;

                & .player {
                    position: absolute;
                    transition: 0.2s;
                    background-image: url('@/assets/imgs/player.png');
                    background-size: cover;
                    width: 50px;
                    height: 50px;
                    top: 50%;
                    left: 50%;
                    opacity: 0;
                    transform: translate(-50%, -50%);

                    &:hover {
                        background-image: url('@/assets/imgs/player_light.png');
                    }
                }

                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    transition: 0.3s;
                    opacity: 0;
                    border-radius: 10px;
                }

                & .mv_listener {
                    background-color: rgba(0, 0, 0, 0.6);
                    position: absolute;
                    border-radius: 10px;
                    bottom: 10px;
                    right: 10px;
                    color: white;
                    font-size: 12px;
                    padding: 3px;
                    padding-left: 5px;
                    padding-right: 5px;
                }

                & .mv_introduce {
                    position: absolute;
                    bottom: 0px;
                    transform: translateY(100%);
                    width: 100%;

                    & .mv_name {
                        font-size: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    & .mv_author {
                        color: gray;
                    }
                }

                &:hover {
                    transform: translate(-15px, -15px);
                    cursor: pointer;

                    &::before {
                        opacity: 1;
                    }

                    & .player {
                        opacity: 1;
                    }
                }

                &:nth-child(1) {
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>