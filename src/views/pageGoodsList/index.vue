<template>
    <a-space style="width: 100%;" :size="8" direction="vertical">
        <a-row type="flex" :gutter="8">

            <a-col flex="auto">
                <search-box></search-box>
            </a-col>
            <a-col>
                <add-item @click="addNew"></add-item>
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

    <item-table @showItemDeatil="showItemDeatil"></item-table>

    <!-- 详情页 -->
    <detail-drawer :isNew="isNew" ref="drawer"></detail-drawer>


</template>


<script setup lang="ts">


import { onMounted, ref, watch } from 'vue';
import type { goodsInfoType } from '../../types'

import searchBox from './searchBox.vue';
import addItem from './addItem.vue'
import itemTable from './itemTable.vue'
import detailDrawer from './detailDrawer.vue'
import { store } from '../../store';

type drawerType = InstanceType<typeof detailDrawer>
const drawer = ref<drawerType | null>(null)
const isNew = ref(false)



onMounted(() => {
    watch(() => (drawer as any).value.open, (nv, ov) => {
        // 抽屉打开关闭的时候控制一下 isNew
        if ((nv as any ) === false){
            isNew.value = false
        }
    })

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

const addNew = () => {
    (drawer as any).value.currentItem.key  =  -1;
    (drawer as any).value.currentItem.mark = '';
    (drawer as any).value.currentItem.name = '';
    (drawer as any).value.currentItem.quan =  0;
    (drawer as any).value.baseQuan         =  0;
    (drawer as any).value.currentItem.unit = '';
    (drawer as any).value.quanDelta        =  0;

    isNew.value = true;
    (drawer as any).value.open = true
}

const showItemDeatil = (record: goodsInfoType) => {
    // 点击 table 中的详情, 弹出详情页面
    //(drawer as any).value.currrentItem = record
    (drawer as any).value.currentItem.key  = record.key;
    (drawer as any).value.currentItem.mark = record.mark;
    (drawer as any).value.currentItem.name = record.name;
    (drawer as any).value.currentItem.quan = record.quan;
    (drawer as any).value.baseQuan         = record.quan;
    (drawer as any).value.currentItem.unit = record.unit;
    (drawer as any).value.quanDelta        =           0;
    

    (drawer as any).value.open = true
    
}

</script>