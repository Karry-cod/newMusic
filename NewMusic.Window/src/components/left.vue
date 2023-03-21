<template>
  <div>
    <div class="title" v-for="item in data.menus" :id="item.id">
      <span>{{ item.title }}</span>
      <ul style="padding: 0px">
        <li v-for="menu in item.menus" :id="menu.id" :class="menu.isChecked ? 'active' : ''" @click="checkMenu(menu)">{{
          menu.title
        }}</li>
      </ul>
    </div>
    <!-- 我的歌单 -->
    <div class="mySheet title">
      <div style="display:flex">
        <div style="width:50%">我的歌单</div>
        <div style="width:50%;text-align: right;">
          <span style="font-size:15px;cursor:pointer;transform: scale(2);display:inline-block">+</span>
        </div>
      </div>
      <ul style="padding:0px">
        <li v-for="item in data.mySheets" :key="item.msid" @click="toSheet(item.msid)">
          <svg t="1677658845889" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2777" width="20" height="20">
            <path
              d="M964.608 234.496c-46.08-52.565333-104.789333-93.696-169.642667-118.784a34.030933 34.030933 0 0 0-46.421333 31.744v420.352a178.005333 178.005333 0 0 0-110.933333-38.741333c-98.816 0-179.2 80.384-179.2 179.2S538.794667 887.466667 637.610667 887.466667s179.2-80.384 179.2-179.2c0-1.877333-0.170667-3.754667-0.341334-5.632 0-1.024 0.341333-1.877333 0.341334-2.901334V201.216c36.181333 20.309333 69.12 46.933333 96.597333 78.165333 12.458667 14.165333 34.133333 15.530667 48.128 3.072 14.165333-12.288 15.530667-33.792 3.072-47.957333zM637.610667 819.2c-61.098667 0-110.933333-49.834667-110.933334-110.933333s49.834667-110.933333 110.933334-110.933334 110.933333 49.834667 110.933333 110.933334-49.834667 110.933333-110.933333 110.933333zM185.344 307.2h392.533333c18.773333 0 34.133333-15.36 34.133334-34.133333s-15.36-34.133333-34.133334-34.133334h-392.533333a34.133333 34.133333 0 1 0 0 68.266667zM424.277333 460.8h-238.933333c-18.773333 0-34.133333 15.36-34.133333 34.133333s15.36 34.133333 34.133333 34.133334h238.933333c18.773333 0 34.133333-15.36 34.133334-34.133334s-15.36-34.133333-34.133334-34.133333zM321.877333 682.666667h-136.533333c-18.773333 0-34.133333 15.36-34.133333 34.133333s15.36 34.133333 34.133333 34.133333h136.533333c18.773333 0 34.133333-15.36 34.133334-34.133333s-15.36-34.133333-34.133334-34.133333z"
              p-id="2778"></path>
          </svg>
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue';
import type { IMenus , IMusicSheet } from "@/utils/interfaces"
import router from "@/router"
import { getCookie } from "@/utils/cookie"
import Login from "@/api/apis/login"

let model = defineProps<{
  menus: IMenus[],
}>();

let data = reactive({
  menus: <IMenus[]>[],
  url: "/",
  mySheets: <IMusicSheet[]>[]
});

toRefs(data);

let { checkMenu , toSheet } = {
  // 检索路由是否匹配菜单栏
  checkMenu(menu: IMenus) {
    data.menus.forEach(item => {
      item.isChecked = false;
      item.menus.forEach(m => {
        m.isChecked = false;
      });
    });
    menu.isChecked = true;
    router.push(menu.path);
  },
  // 跳转歌单
  toSheet(msid:string){
    router.push("/musicSheet/" + msid);
  }
};

let events = {
  // 判断是否登录，并获取我的歌单
  getMySheets() {
    if (getCookie("user")) {
      let user = JSON.parse(getCookie("user") as any);
      Login.getUserSheets({ uid: user.uid }).then((res:any) => {
        if(res.code === 200){
          data.mySheets = res.playlist.map((d:any) => {
            return <IMusicSheet>{
              msid: d.id,
              name: d.name,
              listener: d.playCount,
              sheetImg: d.coverImgUrl,
              tags: d.tags
            }
          });
          data.mySheets.splice(0 , 1);
        }
      });
    }
  }
};

onMounted(() => {
  data.menus = model.menus;
  setInterval(() => {
    data.url = router.currentRoute.value.path;
    let mark = false;
    data.menus.forEach(item => {
      item.menus.forEach(menu => {
        if (menu.path == data.url) {
          mark = true;
          item.isChecked = true;
        }
      });

    });
    if (!mark) {
      data.menus.forEach(item => {
        item.menus.forEach(menu => {
          menu.isChecked = false;
        });

      });
    }
  }, 100)
  events.getMySheets();
})
</script>

<style lang="scss" scoped>
.title {
  width: 80%;
  font-size: 16px;
  margin: 0px auto;
  margin-top: 20px;

  &:nth-child(1) {
    margin-top: 0px;
  }
}

ul {
  margin-top: 10px;
  width: 100%;
}

li {
  width: 100%;
  letter-spacing: 3px;
  list-style: none;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  padding-left: 20px;
  margin-top: 5px;
  transition: 0.3s;
  line-height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  & .icon {
    fill: black;
    transform: translateY(4px)
  }
}

li:hover {
  background-color: rgb(221, 229, 231);
}

.active {
  color: white;
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  --tw-gradient-from: #2dd4bf;
  --tw-gradient-stops: var(--tw-gradient-from),
    var(--tw-gradient-to, rgb(45 212 191 / 0));
  --tw-gradient-to: #34d399;
  --tw-text-opacity: 1;
}
</style>