<template>
    <a-select 
        allowClear 
        autofocus 
        style="width: 100%" 
        mode="multiple" 
        placeholder="搜索货物..." 
        :options="getItemsData"
        :filter-option="filterOption" 
        @change="itemChange" 
        size="large" 
        notFoundContent="暂时没有货物呢, 先 `添加` 一个？"
        bordered></a-select>
    
</template>

<script lang="ts">

import { computed } from 'vue'
import { useStore } from  '../../store'
import { pinyin } from 'pinyin-pro'
import type { SelectProps } from 'ant-design-vue'
interface itemsData extends SelectProps {
    value: any
    key: string
    keyword: string
}

function generate_keyword(str: string) {
    // 传入中文字符串, 返回对应的搜索关键字字符串.
    return (str + pinyin(str, { toneType: 'none' }) + pinyin(str, { toneType: 'none', pattern: 'first' })).replace(/\s/g, "").toLowerCase()
}

</script>

<script lang=ts setup>

const store = useStore()

const filterOption = (input: string, option: itemsData) => {
    // 当用户输入搜索的时候, 此方法会被调用, 如果返回 True, option选项将会显示在下拉栏中.
    // console.log(input, option)
    return option.keyword.toLowerCase().indexOf(input) >= 0
};

const itemChange = (values: string[]) => {
    // 选项更改
    store.state.tableDataSource.length = 0; // 清空
    if (values.length == 0){
        // 没有选项, 全部显示
        for (let item of store.state.goods){
            store.state.tableDataSource.push(JSON.parse(JSON.stringify(item)))
        }
        // store.state.tableDataSource = store.state.goods

    }else{
        // 有选项, 显示选中项
        for (let item of store.state.goods){
            if (values.indexOf(item.name) >= 0){
                store.state.tableDataSource.push(JSON.parse(JSON.stringify(item)))
            }
        }
    }
    // console.log("tableDataSource: ", store.state.tableDataSource)
    // console.log("goods: ", store.state.goods)
}

const getItemsData = computed<itemsData[]>(() => {
    let result: itemsData[] = []
    
    for (let item of store.state.goods) {
        result.push({
            value: item.name,
            key: item.key,
            keyword: generate_keyword(item.name)
        })
    }
    return result
})

</script>



