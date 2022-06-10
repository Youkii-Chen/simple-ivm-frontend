<template>
    <a-space style="width: 100%;" :size="8" direction="vertical">
        <a-row type="flex" :gutter="8">

            <a-col flex="auto">
                <search-box></search-box>
            </a-col>
            <a-col>
                <add-item @open="openToNew"></add-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col flex="auto">
                <a-typography-paragraph style="margin: 0" type="secondary">允许使用中文, 全拼, 首字母简拼搜索, 例如: "苹果"、"pingguo"、"pg"
                </a-typography-paragraph>
            </a-col>
        </a-row>
    </a-space>

    <a-divider style="margin: 8px 0" />

    <!-- <item-table @showItemDeatil="showItemDeatil"></item-table> -->
    <item-table @showItemDeatil="showItemDetail"></item-table>


    <!-- 详情页 -->
    <detail-drawer :isNew="isNew"></detail-drawer>


</template>

<script setup lang="ts">


import { onMounted, ref } from 'vue';
import type { cateGoodsType } from '../../types'

import searchBox from './searchBox.vue';
import addItem from './addItem.vue'
import itemTable from './itemTable.vue'
import detailDrawer from './detailDrawer.vue'
import { store } from '../../store';

const isNew = ref<boolean>(false)

const showItemDetail = (record: cateGoodsType) => {
    store.state.currentItem = JSON.parse(JSON.stringify(record)) // 深拷贝
    for(let item of store.state.currentItem.goods){
        item.base = item.quan
    }
    isNew.value = false
    store.state.openDrawer = true
}
function openToNew(){
    isNew.value = true
    store.state.currentItem = {
        key: 'add', // !重要 用于指定是新建项目, 因为 add 和 update共用一个接口
        name: '',
        mark: '',
        unit: '',
        goods: []
    }
    store.state.openDrawer = true
}

onMounted(() => {
    while (true) {
        if (store.state) break
    }

    if (store.state.goods.length <= 0){
        // 获取货物
        store.dispatch("get_goods")
    }if (store.state.goods.length > 0 && store.state.tableDataSource.length == 0){
        for (let item of store.state.goods){
            store.state.tableDataSource.push(item)
        }
    }
})


</script>