import { createApp } from 'vue'

import GlobalConfigProvider from './GlobalConfigProvider.vue'

// antd css
import 'ant-design-vue/dist/antd.css';

import { router } from './route';
import {store, key} from './store'



const App = createApp(GlobalConfigProvider)
App.use(store, key)
App.use(router)

App.mount('#app')

