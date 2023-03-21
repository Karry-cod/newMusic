<template>
  <div class="outside">
    <!-- 容器  -->
    <div class="container">
      <!-- 左侧栏 -->
      <div :class="!form.isFlex ? 'left' : 'left flex'">
        <img src="@/assets/imgs/wangyiyun_logo.png" style="width: 80%;height:100px;transform: scaleY(2);" alt="">
        <!-- 专栏 -->
        <Left :menus="menus" />
      </div>
      <!-- 右侧栏 -->
      <div class="right">
        <!-- 伸缩按钮 -->
        <div class="flexButton" @click="flexLeft()"></div>
        <!-- 头部 -->
        <div class="header">
          <Header />
        </div>
        <!-- 中心 -->
        <div class="main">
          <RouterView :key="$route.fullPath"></RouterView>
        </div>
        <!-- 底部 -->
        <div class="footer">
          <Footer />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import Left from "@/components/left.vue";
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import type { IMenus } from "@/utils/interfaces";

export default defineComponent({
  components: {
    Left,
    Header,
    Footer
  },
  setup() {
    let data = reactive({
      menus: <IMenus[]>[
        {
          id: '0',
          title: "在线音乐",
          menus: [
            { id: 'a0', title: '推荐', isChecked: true, path: "/" },
            { id: 'a1', title: '音乐馆', path: "/musicBank" },
            { id: 'a2', title: '视频', path: "/video" },
            { id: 'a3', title: '电台', path: "/radioStation" }
          ]
        },
        {
          id: '1',
          title: '我的音乐',
          menus: [
            { id: 'a4', title: '我喜欢', path: "/myLike" },
            { id: 'a5', title: '本地歌曲', path: "/localMusic" },
            { id: 'a6', title: '下载歌曲', path: "/downloadMusic" },
            { id: 'a7', title: '最近播放', path: "/recentlyMusic" }
          ]
        }
      ],
      form: {
        isFlex: false
      },
    });

    const methods = {
      // 隐藏左侧菜单栏
      flexLeft() {
        data.form.isFlex = !data.form.isFlex;
      }
    };

    const events = {

    };

    return {
      ...toRefs(data),
      ...methods,
      events
    };
  },
  mounted() {
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;

  .left {
    width: 20%;
    height: 100%;
    max-width: 300px;
    min-width: 280px;
    background-color: rgb(246, 246, 246);
    padding: 10px;
    overflow: scroll;
    background-repeat: no-repeat;
    background-size: 100% 33%;
    background-position: 0px 100%;
    transition: 0.5s;
    float: left;
    position: relative;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .flex {
    padding: 0px;
    width: 0px;
    height: 0px;
    opacity: 0;
    // animation: flexBox 0.5s alternate;
    min-width: 0px;
  }

  .right {
    height: 100%;
    width: 100%;
    position: relative;

    .flexButton {
      position: absolute;
      border-radius: 10px;
      width: 50px;
      height: 40px;
      background-image: url('@/assets/imgs/dont.png');
      background-size: 30px 30px;
      background-position: center;
      background-repeat: no-repeat;
      left: -25px;
      top: 45%;
      cursor: pointer;
      z-index: 999;
      transition: 0.3s;
      opacity: 0.4;

      &:hover {
        opacity: 1;
        box-shadow: 0px 0px 5px white;
      }
    }

    .header {
      width: 100%;
      height: 7%;
    }

    .main {
      width: 100%;
      height: 83%;
      min-height: 520px;
      overflow: scroll;
    }

    .main::-webkit-scrollbar {
      display: none;
    }

    .footer {
      width: 100%;
      height: 10%;
      border-top: 1px solid rgb(249, 250, 251);
    }
  }
}
</style>