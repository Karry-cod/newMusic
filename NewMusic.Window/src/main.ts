import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/assets/style/index.scss"
// import Cookie from "js-cookie"
import './assets/main.css'
import './samples/node-api'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
// import { createApp } from 'vue'
// import "./style.css"
// import App from './App.vue'
// import './samples/node-api'

// createApp(App)
//   .mount('#app')
//   .$nextTick(() => {
//     postMessage({ payload: 'removeLoading' }, '*')
//   })