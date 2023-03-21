<template>
    <div class="body boxSide">
        <div class="event" v-for="(item, index) in showEvents" :key="item.id"
            :style="index == showEvents?.length - 1 ? 'border-bottom:0px' : ''">
            <!-- 用户信息 -->
            <div class="user">
                <div>
                    <img :src="item.user.avatarUrl" alt="">
                </div>
                <div>
                    <p style="color:darkcyan">
                        {{ item.user.nickname }}
                        <span style="font-size: 0.6rem;color:gray"> 发布动态...</span>
                    </p>
                    <p style="font-size: 0.5rem;color:gray;margin-top: 5px;">
                        {{ formatDate(item.showTime) }}
                    </p>
                </div>
            </div>
            <!-- 动态内容 -->
            <div class="info">
                <p>
                <div v-html="item.event.msg"></div>
                </p>
                <!-- 单曲 -->
                <div class="song" v-if="item.event.song" @click="playSong(item.event.song)">
                    <div>
                        <img :src="item.event.song.album.picUrl" alt="">
                    </div>
                    <div>
                        <p>{{ item.event.song.name }}</p>
                        <p style="font-size: 0.8rem;color:gray">{{ item.event.song.artists[0].name }}</p>
                    </div>
                </div>
                <!-- 电台 -->
                <div class="program song" v-if="item.event.program" @click="playDJ(item.event.program.mainTrackId)">
                    <div>
                        <img :src="item.event.program.coverUrl" alt="">
                    </div>
                    <div>
                        <p>{{ item.event.program.name }}</p>
                        <p
                            style="font-size: 0.8rem;color:gray;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                            <span
                                style="color:red;border: 1px solid red;display: inline-block;padding-left: 4px;padding-right: 4px;line-height: 16px;">{{
                                    item.event.program.radio.category
                                }}</span>
                            {{ item.event.program.radio.desc }}
                        </p>
                    </div>
                </div>
                <!-- 视频 -->
                <div v-if="item.event.video" class="video">
                    <div v-show="!item.showVideo" @click="playVideo(item)" class="img"
                        :style="'background-image:url(' + item.event.video.coverUrl + ')'"></div>
                    <div v-show="item.showVideo">
                        <p>
                            <span class="slow" @click="slowdownVideo(item)">收起</span>
                        </p>
                        <video :id="item.id" autoplay controls :src="item.videoUrl"></video>
                    </div>
                </div>
                <!-- 歌手 -->
                <div class="song artist" v-if="item.type === 36" @click="router.push('/artist/' + item.event.resource.id)">
                    <div>
                        <img :src="item.event.resource.picUrl" alt="">
                    </div>
                    <div>
                        <p>歌手：{{ item.event.resource.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue"
import User from "@/api/apis/user"
import Store from "@/utils/store"
import type { IMusic } from "@/utils/interfaces"
import MV from "@/api/apis/mv"
import Music from "@/api/apis/music"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import router from "@/router/index"

export default defineComponent({
    setup() {
        let data = reactive({
            events: <any>[],
            showEvents: <any>[],
            limit: 60,
            lasttime: -1,
            total: 0
        });

        let methods = {
            // 时间戳转换
            formatDate(date: number) {
                let time = new Date(date);
                return time.getFullYear() + "-" + this.repairZero((time.getMonth() + 1)) + "-" + this.repairZero(time.getDate()) + " " + this.repairZero(time.getHours()) + ":" + this.repairZero(time.getMinutes()) + ":" + this.repairZero(time.getSeconds());
            },
            // 补零
            repairZero(num: number) {
                if (num < 10) {
                    return "0" + num;
                } else {
                    return num;
                }
            },
            // 播放视频
            playVideo(event: any) {
                event.showVideo = true;
                if (event.videoUrl) {
                    (document.getElementById(`${event.id}`) as any).play();
                } else {
                    MV.getVideoUrl({ id: event.event.video.videoId }).then((res: any) => {
                        if (res.code === 200) {
                            event.videoUrl = res.urls[0].url;
                        }
                    });
                }
            },
            // 收起视频
            slowdownVideo(event: any) {
                event.showVideo = false;
                (document.getElementById(`${event.id}`) as any).pause();
            },
            // 播放音乐
            playSong(song: any) {
                let music = <IMusic>{
                    mid: song.id,
                    name: song.name,
                    time: song.duration,
                    backImg: song.album.picUrl,
                    musicImg: song.album.picUrl,
                    author: song.artists[0].name
                };
                Store.player.playSong(music);
            },
            // 播放电台
            playDJ(id: any) {
                Music.getSongDetails({ ids: id }).then((res: any) => {
                    if (res.code === 200) {
                        if (res.songs.length === 0) {
                            ElMessage.error("该资源已不存在");
                            return;
                        }
                        let song = <IMusic>{
                            mid: id,
                            name: res.songs[0].name,
                            time: res.songs[0].dt,
                            backImg: res.songs[0].al.picUrl,
                            musicImg: res.songs[0].al.picUrl,
                            author: res.songs[0].ar[0].name
                        };
                        Store.player.playSong(song);
                    }
                });
            },
        };

        let events = {
            // 获取用户动态
            getUserEvents() {
                let router = useRouter();
                let uid: any = router.currentRoute.value.params.uid;
                User.getUserEvents({ uid, limit: data.limit, lasttime: data.lasttime }).then((res: any) => {
                    if (res.code === 200) {
                        data.events = res.events;
                        data.events.forEach((d: any) => {
                            d.event = JSON.parse(d.json);
                            // 获取# xxx #标签
                            let labels: any = [];
                            for (let i = 0; i < d.event.msg.length; i++) {
                                if (d.event.msg.substring(i, i + 1) == "#") {
                                    labels.push(i);
                                }
                            }
                            if (labels.length >= 2) {
                                labels.forEach((i: number, index: number) => {
                                    if (index % 2 != 0) {
                                        let char = d.event.msg.substring(0, i + 1);
                                        labels[index + 1] ? labels[index + 1] = i + 5 : null;
                                        d.event.msg = d.event.msg.replace(char, `${char}</a>`);
                                    } else if (index % 2 === 0 && labels[index + 1]) {
                                        let char = d.event.msg.substring(0, i + 1);
                                        labels[index + 1] += 22;
                                        d.event.msg = d.event.msg.replace(char, `<a style='color:blue'>#`);
                                    }
                                });
                            }
                        })
                        data.showEvents = data.events.slice(0, 60);
                        data.total = res.size;
                        data.lasttime = res.lasttime;
                        console.log(res);
                    }
                });
            }
        };

        onMounted(() => {
            events.getUserEvents();
        })

        return {
            ...toRefs(data),
            ...methods,
            router
        }
    }
})
</script>

<style lang="scss" scoped>
.body {
    width: 80%;
    padding-top: 10px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: 0 auto;

    & .event {
        border-bottom: 1px solid gray;
        padding-bottom: 10px;
        margin-top: 20px;

        & .user {
            display: flex;

            &>div:nth-child(1) {
                width: 70px;

                &>img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }

            &>div:nth-child(2) {
                width: 90%;
            }
        }

        & .info {
            width: 90%;
            margin-left: 70px;
            font-weight: 600;

            &>.video {
                padding-top: 10px;

                &>.img {
                    width: 400px;
                    height: 250px;
                    border-radius: 10px;
                    background-size: 100% 100%;
                    position: relative;
                    cursor: pointer;

                    &::before {
                        content: "";
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        background-image: url('@/assets/imgs/player.png');
                        background-size: 100% 100%;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        transition: 0.3s;
                    }

                    &:hover {

                        &::before {
                            background-image: url('@/assets/imgs/player_light.png');
                        }
                    }
                }

                & video {
                    width: 100%;
                    height: 500px;
                    background-color: black;
                }

                & .slow {
                    text-decoration: underline;
                    cursor: pointer;
                    display: inline-block;
                    color: gray;

                    &:hover {
                        color: lightgreen;
                    }
                }
            }

            &>.song {
                background-color: rgb(51, 52, 54, 0.1);
                transition: 0.2s;
                cursor: pointer;
                padding: 5px;
                padding-top: 8px;
                padding-bottom: 8px;
                width: 100%;
                height: 80px;
                border-radius: 10px;
                display: flex;

                &:hover {
                    background-color: rgb(54, 55, 58, 0.2);
                }

                &>div:nth-child(1) {
                    width: 70px;
                    height: 100%;

                    &>img {
                        border-radius: 10px;
                        width: 100%;
                        height: 100%;
                    }

                    &::before {
                        content: "";
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        background-image: url('@/assets/imgs/player.png');
                        background-size: 40px 40px;
                        background-position: center;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 999;
                    }
                }

                &>div:nth-child(2) {
                    width: calc(100% - 70px);
                    height: 100%;
                    padding-left: 13px;
                    font-weight: 600;
                    line-height: 30px;
                }
            }

            &>.artist {
                &>div:nth-child(1) {
                    &::before {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>