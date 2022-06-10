<template>
    <!-- 正文表格 -->
    <a-table :columns="columns" :dataSource="dataSource">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'quan'">
                {{ getTotalQuan(record) }}
            </template>

            <template v-if="column.key === 'detail'">
                <a-button @click="$emit('showItemDeatil', record)">详情</a-button>
            </template>
        </template>
    </a-table>
</template>
<script lang="ts">

import type { TableColumnType } from 'ant-design-vue'

const columns: TableColumnType[] = [
    {
        title: '品名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '数量',
        dataIndex: 'quan',
        key: 'quan',
        width: '4rem',
        align: "center"
    },
    {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: '4rem',
        align: "center"
    },
    {
        title: '详情',
        key: 'detail',
        width: '3rem',
        align: "center"
    },
]

import { defineComponent, computed } from "vue"
import { useStore } from '../../store' 
import { cateGoodsType } from '../../types'

export default defineComponent({
    emits: ['showItemDeatil'],
    setup(){
        const store = useStore()

        return{
            store,
            columns,
            dataSource: computed(() => store.state.tableDataSource),
            getTotalQuan(record: cateGoodsType){
                let count = 0
                for (let item of record.goods){
                    count += item.quan
                }
                return count
            }
        }
    }
})
</script>
<style lang="">
    
</style>