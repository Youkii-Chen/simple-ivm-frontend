import { createApp } from 'vue'

import GlobalConfigProvider from './GlobalConfigProvider.vue'

// antd css
import 'ant-design-vue/dist/antd.css';

import { store, key } from './store'
import { router } from './route';

const App = createApp(GlobalConfigProvider)

document.addEventListener('visibilitychange', function () {
    // 用户打开或回到页面
    var prev = Date.now()
    return function () {
        if (document.visibilityState === 'visible') {
            let now = Date.now()
            if (now - prev > 7000){
                // 防抖 五秒刷一次
                if (store.state.isLogined) {
                    store.dispatch('get_goods')
                    prev = now
                }
            }
        }
    }

}());



App.use(store, key)
App.use(router)

App.mount('#app')

