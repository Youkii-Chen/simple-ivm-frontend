import { createApp } from 'vue'

import GlobalConfigProvider from './GlobalConfigProvider.vue'

// antd css
import 'ant-design-vue/dist/antd.css';

import { store, key } from './store'
import { router } from './route';

const App = createApp(GlobalConfigProvider)
App.use(store, key)
App.use(router)

App.mount('#app')

