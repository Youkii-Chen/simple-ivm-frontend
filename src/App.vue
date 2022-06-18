<template>
    <div v-if="loading" id="loading">
        <a-spin />
    </div>
    <a-layout style="min-height: 100vh">
        <a-layout-header style="padding: 16px 16px; line-height: 32px; background-color: #74b9ff;">
            <a-row type="flex" align="middle" :gutter="8" style="height: 32px;">
                <a-col>
                    <h1 id="title">IVM-库存管理系统</h1>
                </a-col>
                <a-col flex="auto"></a-col>
                <a-col>
                    <a-tooltip>
                        <template #title>刷新</template>
                        <a-button @click="reflesh" type="text" shape="circle">
                            <template #icon>
                                <redo-outlined :style="{ fontSize: '24px', color: 'rgb(255,255,255,.85)' }" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-col>
                <!-- <a-col>
                    <a-tooltip>
                        <template #title>退出登录</template>
                        <a-button @click="store.dispatch('logout')" type="text" shape="circle">
                            <template #icon>
                                <logout-outlined :style="{ fontSize: '24px', color: 'rgb(255,255,255,.85)' }" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-col> -->
            </a-row>
        </a-layout-header>


        <a-layout-content style="padding: 8px">
            <router-view></router-view>
        </a-layout-content>

        <a-layout-footer id="footer">
            <a-typography-text>粤ICP备2022068682号-1</a-typography-text>
        </a-layout-footer>


    </a-layout>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { LogoutOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from './store';
import { notification } from 'ant-design-vue'

notification.config({
    duration: 1.5
})
// let selectedKeys = ref<string[]>(['4'])
// watch(selectedKeys, (nv, ov)=>{
//     // 导航栏选项改变
//     // console.log(nv[0])
// })

const store = useStore()
const router = useRouter()
const loading = computed(() => store.state.loading)

function reflesh() {
    if (!store.state.isLogined) { return }
    
    store.dispatch('get_goods')
}
onMounted(() => {
    while (true) {
        if (store.state) break
    }
    // 进入导航
    if (!store.state.debug) {
        // 未在debug, 自动跳转
        if (store.state.isLogined){
            router.replace('/goods')
        } else {
            router.replace('/login')
        }
    }
})


</script>

<style scoped>
#title {
    /* line-height: 32px; */
    display: inline-block;
    height: 32px;
    padding: 0;
    margin: 0;
    color: rgba(245, 250, 255, 0.85);
    font-weight: normal;
    font-size: 24px;
}

#footer {
    /* background-color: transparent; */
    display: block;
    text-align: center;
    font-size: 12px;
}

#loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}
</style>