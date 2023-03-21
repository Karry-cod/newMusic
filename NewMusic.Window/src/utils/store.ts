import type { IMusic } from "./interfaces"
import Music from "@/api/apis/music";

let store = {
    player: {
        // 待听列表
        waitSongs: <IMusic[]>[],
        // 当前播放的音乐
        currentSong: <IMusic>{
            name: "暂无播放歌曲",
            musicImg: "http://p2.music.126.net/SA6bW1UlPP04rFB2pj-FvQ==/109951165813403264.jpg",
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
                    store.player.currentSong.time = music.time;
                    store.player.currentSong.source = music.url;
                    store.player.type = 1;
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
        type: 0  // 0：准备中，1：开始播放，2：播放中
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