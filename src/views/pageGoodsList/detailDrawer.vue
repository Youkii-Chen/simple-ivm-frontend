<template>

    <a-drawer title="货物详情" width="100vw" :visible="open" placement="right" @close="store.state.openDrawer = false">
        <template #extra>
            <a-button style="margin-right: 8px;" type="primary" @click="formSave">
                保存</a-button>
            <a-popconfirm title="确定要删除 |整个分类| 吗?" ok-text="是的" cancel-text="算了" @confirm="deleteItem">
                <a-button :disabled="isNew" type="danger">删除</a-button>
            </a-popconfirm>
        </template>
        <a-form :model="currentItem" ref="form">
            <a-row :gutter="8">
                <a-col :span="12">
                    <a-form-item name="name" label="货物类名" :rules="{
                        required: true,
                        message: '未填入名称',
                    }">
                        <a-input :disabled="!isNew" v-model:value="currentItem.name" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="unit" label="货物单位" :rules="{
                        required: true,
                        message: '未填入单位',
                    }">
                        <!-- <a-input v-model:value="currentItem.unit" /> -->
                        <a-auto-complete v-model:value="currentItem.unit" placeholder="输入货物单位..." :options="units">
                        </a-auto-complete>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item name='mark' label="备注">
                <a-textarea placeholder="暂时没有备注哦~" :rows="2" v-model:value="currentItem.mark" />
            </a-form-item>

            <a-form-item>
                <a-button type="dashed" block @click="addGoods">
                    <PlusOutlined />
                    新增项目
                </a-button>
            </a-form-item>
            <a-row :gutter="8" v-for="(goods, index) in currentItem.goods" :key="goods.key">
                <template v-if="goods.flag !== 'del'">
                    <!-- 暂时不需要删除按钮 -->
                    <!-- <a-col :span="2">
                        <a-popconfirm title="确定要删除这个项目吗?" ok-text="是的" cancel-text="算了" @confirm="removeGoods(goods)">
                            <MinusCircleOutlined style="padding-top: 8px" @click="" />
                        </a-popconfirm>
                    </a-col> -->

                    <a-col :span="10">
                        <a-form-item :name="['goods', index, 'name']" :rules="{
                            required: true,
                            message: '未填入名称',
                        }">
                            <a-input v-model:value="goods.name" placeholder="名称" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item :min="0" :name="['goods', index, 'quan']" :rules="{
                            required: true,
                            message: '未填入数量',
                        }">
                            <a-input-number v-model:value="goods.quan" :disabled="goods.flag !== 'add'"
                                style="width: 100%" placeholder="数量" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item>
                            <a-input-number @click="deltaBlur(goods)" :min="-goods.base!" @change="deltaVChange(goods)"
                                :disabled="isNew || goods.flag === 'add'" v-model:value="deltas[goods.key]"
                                style="width: 100%" placeholder="变化" />
                        </a-form-item>
                    </a-col>

                </template>
            </a-row>
        </a-form>

    </a-drawer>

</template>

<script setup lang="ts">
// ===========================
// TODO: 修改请求接口
// 完成多项目修改
// ===========================

import { toRefs, computed, ref, watch, reactive } from "vue"
import { useStore } from "../../store"
import { FormInstance } from "ant-design-vue";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import { cateGoodsType, goodsInfoType } from "../../types";

const props = defineProps({
    isNew: {
        type: Boolean,
        default: true
    },
})


const { isNew } = toRefs(props)
const store = useStore()
const form = ref<FormInstance>()
const units = [{ value: '斤' }, { value: "包" }, { value: "件" }]
const currentItem = computed(() => store.state.currentItem)
const open = computed(() => store.state.openDrawer)
const deltas = reactive<{ [key: string]: number }>({})

watch(() => store.state.openDrawer, initDeltas)

function deltaBlur(goods: goodsInfoType){
    if (!deltas[goods.key]) {
        deltas[goods.key] = null as any
    }
}

function initDeltas(nv: boolean) {
    if (nv == true) {
        // 打开了抽屉
        // 初始化 deltas
        for (let key in deltas) {
            // 清空一下
            delete deltas[key];
        }
        for (let item of currentItem.value.goods) {
            deltas[item.key] = null as any
        }
    }
}

function removeGoods(goods: goodsInfoType) {
    goods.flag = 'del'
}
function addGoods() {
    currentItem.value.goods.push({
        key: Math.ceil(Math.random() * 10000000) + '',
        flag: 'add',
        name: '',
        quan: 0
    })
}
async function formSave() {
    try {
        await form.value?.validateFields() // 验证表单
    } catch { return }

    // 发送请求
    try {
        let resp = await store.dispatch('update', [currentItem.value, isNew.value])
        // console.log(resp)

        if (isNew.value) {
            store.state.openDrawer = false
        }
        else {
            // 更新数据
            for (let idx in currentItem.value.goods) {
                // 删除操作标记
                if (currentItem.value.goods[idx].flag === 'del') { delete currentItem.value.goods[idx] }
                else { currentItem.value.goods[idx].flag = '' }
            }

            currentItem.value.goods.length = 0
            for (let item of resp.goods) {
                item.base = item.quan
                currentItem.value.goods.push(item)
            }

            initDeltas(true)
        }
    } catch (err) { console.debug(err) }



}

async function deleteItem() {
    try {
        await store.dispatch('del', currentItem.value)
    } catch { }

    store.state.openDrawer = false
}

// function newVChange(goods: goodsInfoType){
//     // 填写新值的输入框改变
//     if(isNew.value){ return } // 新项目不需要监听
//     deltas[goods.key] = goods.quan - (goods.base as number)

//     // console.log(deltas)
// }
// 由双向改成单向, 此处不再需要

function deltaVChange(goods: goodsInfoType) {
    // console.log(deltas[goods.key], goods.quan)
    if (deltas[goods.key] === null) {
        deltas[goods.key] = 0
    }
    goods.quan = (goods.base as number) + deltas[goods.key]
    if (goods.quan < 0) goods.quan = 0
}
</script>
