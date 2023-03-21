<template>
    <div class="player_footer">
        <!-- 进度条 -->
        <div class="player_process_back" @click="toProcess()">
            <div class="player_process" :style="'width:' + process + '%'"></div>
        </div>
        <!-- 播放操作栏 -->
        <div class="player_toolBox">
            <div class="tool_left">
                <!-- 音乐图 -->
                <div>
                    <img :src="currentSong.musicImg" alt="">
                </div>
                <div class="musicInfo">
                    <!-- 歌曲信息 -->
                    <p>
                        <span>
                            <strong>{{ currentSong.name }}</strong>
                            <span style="font-size:12px;color:gray;display:inline-block;transform: translateX(10px);">-
                                {{ currentSong.author }}</span>
                        </span>
                    </p>
                    <!-- 喜欢，下载... -->
                    <div>
                        <div class="love"></div>
                        <div class="download"></div>
                        <div class="communicaty"></div>
                    </div>
                </div>
            </div>
            <!-- 中心播放按钮 -->
            <div class="tool_center">
                <div class="player_outside">
                    <div></div>
                    <div @click="prevSong()"></div>
                    <div @click="changeState()" class="player" id="player"></div>
                    <div @click="nextSong()"></div>
                    <div></div>
                </div>
            </div>
            <!-- 右侧播放进程 -->
            <div class="tool_right">
                <p>
                    {{ nowTime }} / {{ totalTime }}
                <div class="musicWord"></div>
                <div class="musicList" @click="showDrawer = true">
                    <span class="waitCount">{{ waitSongs.length
                    }}</span>
                </div>
                </p>
            </div>
        </div>
        <!-- audio播放器 -->
        <div class="player_audio">
            <audio :src="currentSong.source" controls id="audio"></audio>
        </div>
        <!-- 歌曲列表 - 抽屉 -->
        <div class="drawer">
            <el-drawer v-model="showDrawer" title="播放队列" size="330" :with-header="false">
                <div style="height: 60px;">
                    <h2>播放队列</h2>
                    <div style="display: flex;">
                        <div style="width: 50%;">
                            <span style="color:gray"><strong style="color:black">{{ waitSongs.length }}</strong> 首歌曲</span>
                        </div>
                        <div @click="clearList()" class="drawer_btn">
                            <div style="position: absolute;right:0.5rem;">
                                <el-icon>
                                    <Delete></Delete>
                                </el-icon>
                                清空
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 播放队列 -->
                <div class="mq_outside">
                    <div :class="currentSong.mid == item.mid ? 'mq active' : 'mq'" @dblclick="activeSong(item.mid)"
                        v-for="item in waitSongs">
                        <div style="width: 20%;height: 100%;">
                            <img :src="item.backImg" alt="" style="width:50px;height: 50px;">
                        </div>
                        <div>
                            <p>{{ item.name }}</p>
                            <p style="margin-top: 15px;">{{ item.author }}</p>
                        </div>
                        <div>
                            <span>{{ repairZero(parseInt((item.time / 60000).toFixed(0))) }}:
                                {{ repairZero(parseInt((item.time / 1000 % 60).toFixed(0))) }}</span>
                        </div>
                        <div @click="removeSong(item.mid)">
                            <el-icon>
                                <Delete></Delete>
                            </el-icon>
                            <p>移除</p>
                        </div>
                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watchEffect, toRefs } from 'vue';
import type { IMusic } from "@/utils/interfaces"
import Store from "@/utils/store"
import { ElMessage } from "element-plus"
import { Delete } from '@element-plus/icons-vue'

let data = reactive({
    playState: 0,
    caleprocess: 0,
    process: 0,
    currentSong: <IMusic>{},
    totalTime: "00:00",
    nowTime: "00:00",
    waitSongs: <IMusic[]>[],
    showDrawer: false
});

const { currentSong, totalTime, nowTime, process, waitSongs, showDrawer } = toRefs(data);

const { changeState, startInterval, toProcess, clearList, repairZero, removeSong, activeSong, prevSong, nextSong } = ({
    // 更改播放状态
    changeState: () => {
        if (!data.currentSong.mid) {
            return;
        }
        data.playState += 1;
        events.changePlayer();
    },
    // 计算播放进度
    startInterval: () => {
        let minute = parseInt(data.nowTime.split(":")[0]);
        let second = parseInt(data.nowTime.split(":")[1]);
        data.caleprocess = setInterval(() => {
            second++;
            if (second === 60) {
                minute++;
                second = 0;
            }
            data.nowTime = repairZero(minute) + ":" + repairZero(second);
            data.process = (((minute * 60 + second) * 1000) / data.currentSong.time) * 100;
            if (data.process >= 100) {
                let index = data.waitSongs.findIndex(d => d.mid == data.currentSong.mid);
                Store.player.waitSongs = data.waitSongs;
                if (data.waitSongs[index]) {
                    Store.player.playSong(data.waitSongs[index]);
                } else {
                    clearInterval(data.caleprocess);
                    changeState();
                }
            }
        }, 1000);
    },
    // 进度条点击，跳转
    toProcess: () => {
        if (!data.currentSong.mid) {
            return;
        }
        // 跳转时先停止进度条
        changeState();
        var event: any = event || window.event;
        var processLine = (document.getElementsByClassName("player_process_back")[0] as HTMLElement);
        let diffX = event.pageX - events.getElementLeft(processLine);
        let process = parseFloat((diffX / processLine.clientWidth).toFixed(2));
        let time = parseInt((data.currentSong.time * process).toFixed(0));
        let second = ((time % 60000) / 1000).toFixed(0);
        let minute = (time / 60000).toString().split(".")[0];
        data.process = process * 100;
        data.nowTime = repairZero(parseInt(minute)) + ":" + repairZero(parseInt(second));
        (document.getElementById("audio") as any).currentTime = parseFloat(((data.currentSong.time / 1000) * process).toFixed(0));
        // 计算完需要跳转的点之后重新计时
        changeState();
    },
    // 清空播放队列
    clearList() {
        data.waitSongs = [];
        Store.player.waitSongs = [];
    },
    // 时间格式补零【mm:ss】
    repairZero(num: number) {
        if (num < 10) {
            return "0" + num;
        } else {
            return num.toString();
        }
    },
    // 移除播放队列的歌曲
    removeSong(id: string) {
        let index = data.waitSongs.findIndex(d => d.mid == id);
        data.waitSongs.splice(index, 1);
    },
    // 播放队列中的某首音乐
    activeSong(id: string) {
        let song = <IMusic>data.waitSongs.find(d => d.mid == id);
        Store.player.playSong(song);
    },
    // 切换上一首歌
    prevSong() {
        let index = data.waitSongs.findIndex(d => d.mid == data.currentSong.mid);
        Store.player.playSong(!data.waitSongs[index - 1] ? data.waitSongs[data.waitSongs.length - 1] : data.waitSongs[index - 1]);
    },
    nextSong() {
        let index = data.waitSongs.findIndex(d => d.mid == data.currentSong.mid);
        Store.player.playSong(data.waitSongs[index + 1] ? data.waitSongs[index + 1] : data.waitSongs[0]);
    }
});

const events = {
    // 监听player变量
    listenPlay() {
        setInterval(() => {
            switch (Store.player.type) {
                case 0:
                    data.playState = 0;
                    data.currentSong = Store.player.currentSong;
                    data.nowTime = "00:00";
                    events.changePlayer();
                    break;
                case 1:
                    changeState();
                    Store.player.type = 2;
                    let time = (data.currentSong.time / 60000).toFixed(2);
                    let minute = time.split(".")[0];
                    let second = time.split(".")[1];
                    data.totalTime = repairZero(parseInt(minute)) + ":" + repairZero(parseInt(((parseInt(second)) / 100 * 60).toString()));
                    data.process = 0;
                    break;
                case -1:
                    ElMessage.error("因合作方要求，该歌曲暂时下架");
                    Store.player.type = 0;
            }
        }, 100);
    },
    // 更改播放器显示状态
    changePlayer() {
        let url = data.playState % 2 != 0 ? "url('/src/assets/imgs/stop.png')" : "url('/src/assets/imgs/play.png')";
        data.playState % 2 !== 0 ? startInterval() : clearInterval(data.caleprocess);
        data.playState % 2 !== 0 ? (document.getElementById("audio") as any)?.play() : (document.getElementById("audio") as any)?.pause();
        (document.getElementById("player") as HTMLElement).style.backgroundImage = url;
    },

    // 获取dom在文档中的坐标
    getElementLeft(element: HTMLElement) {
        var actualLeft = element.offsetLeft; // 获取dom相对父元素的距离
        var current = element.offsetParent as HTMLElement
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent as HTMLElement;
        }
        return actualLeft;
    }
};

watchEffect(() => {
    events.listenPlay();
});



onMounted(() => {
    // 监听Store的值改变事件
    Store.refreshModel(Store.player, (newVal: any) => {
        let obj: any = Store.player;
        for (let key in obj) {
            if (Object.is(newVal, obj[key])) {
                switch (key) {
                    case "waitSongs":
                        data.waitSongs = newVal;
                        break;
                }
            };
        }
    });
})

</script>

<style lang="scss" scoped>
.player_footer {
    width: 100%;
    height: 100%;

    .player_process_back {
        width: 100%;
        height: 2px;
        background-color: rgb(196, 186, 186);
        cursor: pointer;

        & .player_process {
            width: 0px;
            height: 100%;
            background-color: lightgreen;
            position: relative;

            &::before {
                content: "";
                position: absolute;
                background-color: lightgreen;
                width: 15px;
                height: 15px;
                top: -7px;
                border-radius: 50%;
                opacity: 0;
                transition: 0.3s;
                right: 0px;
                border: 2px solid rgba(255, 255, 255, 0.7);
            }
        }

        &:hover {
            & .player_process::before {
                opacity: 1;
            }
        }
    }

    .player_toolBox {
        width: 100%;
        height: 100%;
        padding-top: 20px;
        display: flex;

        & .tool_left {
            min-width: 300px;
            display: flex;

            & div:nth-child(1) {
                width: 100px;
                padding-left: 20px;

                & img {
                    width: 100%;
                    height: 70%;
                    border-radius: 5px;
                }
            }

            & div:nth-child(2) {
                width: 100%;

                &>p {
                    padding-left: 20px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: hidden;
                }

                &>div {
                    padding-left: 20px;
                    display: flex;
                    padding-top: 10px;

                    >div {
                        width: 20px;
                        height: 20px;
                        background-position: center;
                        background-size: cover;
                        transition: 0.2s;
                        cursor: pointer;
                    }

                    .love {
                        background-image: url('@/assets/imgs/love.png');

                        &:hover {
                            background-image: url('@/assets/imgs/love_light.png');
                        }
                    }

                    .download {
                        background-image: url('@/assets/imgs/download.png');
                        margin-left: 10px;

                        &:hover {
                            background-image: url('@/assets/imgs/download_light.png');
                        }
                    }

                    .communicaty {
                        background-image: url('@/assets/imgs/com.png');
                        margin-left: 10px;

                        &:hover {
                            background-image: url('@/assets/imgs/com_light.png');
                        }
                    }
                }
            }
        }

        & .tool_center {
            width: 100%;
            background-color: white;

            & .player_outside {
                max-width: 300px;
                height: 100%;
                margin: 0 auto;
                transform: translate(-30%, -10px);
                display: flex;

                >div {
                    background-position: center;
                    background-size: 30px 30px;
                    background-repeat: no-repeat;
                    transition: 0.1s;
                    cursor: pointer;
                    width: 20%;
                }

                &>div:nth-child(1) {
                    background-image: url('@/assets/imgs/reload.png');

                    &:hover {
                        background-image: url('@/assets/imgs/reload_light.png');
                    }
                }

                &>div:nth-child(2) {
                    background-image: url('@/assets/imgs/prev.png');

                    &:hover {
                        background-image: url('@/assets/imgs/prev_light.png');
                    }
                }

                & .player {
                    background-image: url('@/assets/imgs/play.png');
                    background-size: 45px 45px;
                }

                &>div:nth-child(4) {
                    background-image: url('@/assets/imgs/next.png');

                    &:hover {
                        background-image: url('@/assets/imgs/next_light.png');
                    }
                }

                &>div:nth-child(5) {
                    background-image: url('@/assets/imgs/volume.png');

                    &:hover {
                        background-image: url('@/assets/imgs/volume_light.png');
                    }
                }
            }
        }

        & .tool_right {
            min-width: 200px;
            padding-top: 10px;
            font-weight: 600;
            letter-spacing: 1px;
            display: flex;
            font-size: 12px;
            text-align: right;

            & .musicWord {
                width: 20px;
                height: 20px;
                background-size: cover;
                background-image: url('@/assets/imgs/word.png');
                margin-left: 10px;
                cursor: pointer;
                display: inline-block;
                transform: translateY(5px);

                &:hover {
                    background-image: url('@/assets/imgs/word_light.png');
                }
            }

            & .musicList {
                width: 20px;
                height: 20px;
                background-size: 20px 20px;
                background-repeat: no-repeat;
                background-image: url('@/assets/imgs/musicList.png');
                margin-left: 10px;
                display: inline-block;
                transform: translateY(5px);
                cursor: pointer;
                padding-left: 20px;
                position: relative;

                &:hover {
                    background-image: url('@/assets/imgs/musicList_light.png');
                    color: lightgreen;
                }

                & .waitCount {
                    display: block;
                    position: absolute;
                    font-size: 1rem;
                    top: -20%;
                    float: right;
                }
            }
        }
    }

    .drawer {
        overflow-y: scroll;
        z-index: 9999;

        .drawer_btn {
            width: 50%;
            position: relative;
            display: flex;

            &:hover {
                color: lightgreen;
                cursor: pointer;
            }
        }

        .mq_outside {
            width: 100%;
            max-height: calc(100% - 60px);
            overflow-y: scroll;

            &::-webkit-scrollbar {
                display: none;
            }

            & .active {
                color: #10b981;
                background-color: rgba(0, 0, 0, 0.1);
            }

            & .mq {
                display: flex;
                width: 100%;
                height: 70px;
                position: relative;
                overflow: hidden;
                padding-top: 10px;
                transition: 0.2s;
                padding-left: 3px;

                &>div:nth-child(4) {
                    position: absolute;
                    right: -4rem;
                    top: 0px;
                    transition: 0.3s;
                    width: 4rem;
                    height: 100%;
                    text-align: center;
                    background-color: white;
                    padding-top: 4%;
                    font-size: 1rem;
                    cursor: pointer;
                    box-shadow: 0px 5px 5px 1px gray;

                    &:hover {
                        color: lightgreen;
                        box-shadow: 0px 5px 5px 1px green;
                    }
                }

                &>div:nth-child(2) {
                    font-size: 0.5rem;
                    padding-left: 5px;
                    width: 70%;
                }

                &>div:nth-child(3) {
                    width: 20%;
                    height: 100%;
                    font-size: 0.5rem;
                    display: flex;
                    align-items: center;
                    padding-right: 20px;
                }

                &:hover {
                    &>div:nth-child(4) {
                        transform: translateX(-100%);
                    }

                    background-color: rgba(0, 0, 0, 0.1);
                }
            }
        }
    }


}
</style>