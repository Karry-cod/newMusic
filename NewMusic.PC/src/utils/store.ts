import type { IMusic } from "./interfaces"
import Music from "@/api/apis/music";

let store = {
    // 播放器
    player: {
        // 待听列表
        waitSongs: <IMusic[]>[],
        // 当前播放的音乐
        currentSong: <IMusic>{
            name: "暂无播放歌曲",
            musicImg: "/src/assets/OpticalDisk.png",
            source: "",
        },
        // 播放音乐
        playSong: async (song: IMusic) => {
            if (song.mid == store.player.currentSong.mid) {
                return;
            }
            store.player.type = 0;
            store.player.currentSong = song;
            await Music.getSongUrl({ id: song.mid, timerstamp: Date.now() }).then(res => {
                if (res.code === 200) {
                    let music = res.data[0];
                    song.time > 0 ? null : store.player.currentSong.time = music.time;
                    store.player.currentSong.source = music.url;
                    store.player.type = 1;
                    // 歌曲丢失
                    if (music.code === 404) {
                        store.player.type = -1;
                    } else {
                        // 获取歌词
                        // Music.getSongWords({ id: song.mid }).then((result: any) => {
                        //     console.log(result);
                        //     if (result.code === 200) {
                        //         console.log(JSON.parse(result.lrc.lyric));
                        //     }
                        // });
                    }
                }
            });
        },
        // 下载音乐
        downloadSong: async (song: IMusic) => {
            await Music.getSongUrl({ id: song.mid }).then(res => {
                if (res.code === 200) {
                    song.source = res.data[0].url;
                    fetch(song.source)
                        .then(res => res.blob())
                        .then(blob => {
                            const a = document.createElement("a");
                            const objectUrl = window.URL.createObjectURL(blob);
                            a.download = song.name;
                            a.href = objectUrl;
                            a.click();
                            window.URL.revokeObjectURL(objectUrl);
                            a.remove();
                        })
                }
            })
        },
        type: 0  // 0：准备中，1：开始播放，2：播放中，-1：无资源
    },
    // 当前歌单
    currentSheet: {

    },
    // 监听数据的值改变事件
    refreshModel(obj: any, callback?: Function) {
        // 对象使用for，循环key值
        for (let i in obj) {
            let oldVal = obj[i];
            if (typeof oldVal == "object") {
                store.refreshModel(oldVal);
            }
            Object.defineProperty(obj, i, {
                get() {
                    return oldVal;
                },
                set(newVal) {
                    if (typeof newVal == "object") {
                        store.refreshModel(newVal);
                    }
                    oldVal = newVal;
                    typeof callback == "function" ? callback(newVal) : null;
                }
            });
        }
    }
};

export default store;