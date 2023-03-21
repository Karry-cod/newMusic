<template>
    <div class="body boxSide">
        <div v-for="item in follows" :key="item.userId" class="user">
            <div>
                <img :src="item.avatarUrl" alt="" @click="router.push('/user/' + item.userId)" />
            </div>
            <div>
                <p>{{ item.nickname }}</p>
                <p>{{ item.signature }}&nbsp;</p>
                <div>
                    <div style="border-right: 1px solid gray;">歌单：{{ item.playlistCount }}</div>
                    <div>粉丝：{{ item.followeds }}</div>
                </div>
            </div>
            <div>
                <button>
                    <svg t="1678760166320" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2780" width="20" height="20">
                        <path
                            d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z"
                            fill="#969a9c" p-id="2781"></path>
                    </svg>
                    私信
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue"
import User from "@/api/apis/user"
import { useRouter } from "vue-router"
import router from "@/router/index"

export default defineComponent({
    setup() {
        let data = reactive({
            follows: <any>[]
        });

        let events = {
            // 获取用户的关注列表
            getUserFollows() {
                let router = useRouter();
                let uid: any = router.currentRoute.value.params.uid;
                User.getUserFollows({ uid }).then((res: any) => {
                    if (res.code === 200) {
                        data.follows = res.follow;
                    }
                });
            },
            // 获取用户的粉丝列表
            getUserFollowers() {
                let router = useRouter();
                let uid: any = router.currentRoute.value.params.uid;
                User.getUserFollowers({ uid }).then((res: any) => {
                    if (res.code === 200) {
                        data.follows = res.followeds;
                    }
                });
            }
        };

        onMounted(() => {
            let route = useRouter();
            if (route.currentRoute.value.name === "follow") {
                events.getUserFollows();
            } else if (route.currentRoute.value.name === "follower") {
                events.getUserFollowers();
            }
        })

        return {
            ...toRefs(data),
            router
        }
    }
})
</script>

<style lang="scss">
.body {
    width: 83%;
    padding-top: 10px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: 0 auto;

    & .user {
        width: 400px;
        padding-left: 20px;
        padding-right: 10px;
        float: left;
        display: flex;
        margin-left: 3%;
        margin-top: 10px;
        height: 130px;
        padding-top: 15px;

        &>div:nth-child(1) {
            width: 110px;
            height: 100%;

            &>img {
                width: 100%;
                border-radius: 50%;
                cursor: pointer;
            }
        }

        &>div:nth-child(2) {
            width: 210px;
            padding-left: 10px;
            font-weight: 600;
            font-size: 1.1rem;

            &>p:nth-child(2) {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 50px;
                font-size: 0.8rem;
                color: gray;
            }

            &>div {
                display: flex;

                &>div:nth-child(1) {
                    width: 45%;
                    text-align: left;
                }

                &>div:nth-child(2) {
                    width: 55%;
                }

                &>div {
                    color: gray;
                    text-align: center;
                    font-size: 0.8rem;
                }
            }
        }

        &>div:nth-child(3) {
            width: 90px;

            &>button {
                margin-top: 50%;
                border-radius: 15px;
                border: 1px solid gray;
                color: black;
                background-color: white;
                width: 100%;
                font-size: 1rem;
                transition: 0.2s;
                cursor: pointer;

                &:hover {
                    background-color: rgba(0, 0, 0, 0.1);

                    & path {
                        fill: gray;
                    }
                }
            }
        }

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }
}

.icon {
    transform: translateY(4px);
}
</style>