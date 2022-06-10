<template>

    <a-drawer title="货物详情" width="100vw" :visible="open" placement="right" @close="store.state.openDrawer = false">
        <template #extra>
            <a-button style="margin-right: 8px;" type="primary" @click="formSave">
                保存</a-button>
            <a-popconfirm title="确定要删除 |整个分类| 吗?" ok-text="是的" cancel-text="算了"
                @confirm="deleteItem">
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
                        <a-input v-model:value="currentItem.name" />
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
            <a-row :gutter="8" v-for="(goods, index) in currentItem.goods" :key="index">
                <template v-if="goods.flag !== 'del'">
                    <a-col :span="8">
                        <a-form-item :name="['goods', index, 'name']" :rules="{
                            required: true,
                            message: '未填入名称',
                        }">
                            <a-input v-model:value="goods.name" placeholder="名称" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <a-form-item :name="['goods', index, 'quan']" :rules="{
                            required: true,
                            message: '未填入数量',
                        }">
                            <a-input @change="newVChange(goods)" v-model:value="goods.quan" placeholder="数量" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item>
                            <a-input-number @change="deltaVChange(goods)" :disabled="isNew || goods.flag === 'add'" v-model:value="deltas[goods.key]" style="width: 100%" placeholder="变化" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="2">
                        <MinusCircleOutlined style="padding-top: 8px" @click="removeGoods(goods)" />
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

import { toRefs, computed, ref, watch, reactive} from "vue"
import { key, useStore } from "../../store"
import { FormInstance } from "ant-design-vue";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { goodsInfoType } from "../../types";

const props = defineProps({
    isNew: {
        type: Boolean,
        default: true
    },
})


const { isNew } = toRefs(props)
const store = useStore()
const form = ref<FormInstance>()
const units = [{ value: '千克' }, { value: "包" }, { value: "件" }]
const currentItem = computed(() => store.state.currentItem)
const open = computed(() => store.state.openDrawer)
const deltas = reactive<{[key: string]: number}>({})

watch(() => store.state.openDrawer, (nv) => {
    if(nv == true){
        // 打开了抽屉
        // 初始化 deltas
        for(let key in deltas){
            // 清空一下
            delete deltas[key];
        }
        for (let item of currentItem.value.goods){
            deltas[item.key] = 0
        }
    }
})

function removeGoods(goods: goodsInfoType) {
    goods.flag = 'del'
}
function addGoods() {
    currentItem.value.goods.push({
        key: '',
        flag: 'add',
        name: '',
        quan: 0
    })
}
async function formSave() {
    try{
        await form.value?.validateFields() // 验证表单
    }catch{ return }
    
    // 发送请求
    try{
        await store.dispatch('update', [currentItem.value, isNew.value])
    }catch(err){console.log(err)}

    store.state.openDrawer = false
}

async function deleteItem() {
    try{
        await store.dispatch('del', currentItem.value)
    }catch{}
    
    store.state.openDrawer = false
}

function newVChange(goods: goodsInfoType){
    // 填写新值的输入框改变
    if(isNew){ return } // 新项目不需要监听
    deltas[goods.key] = goods.quan - (goods.base as number)
    // console.log(deltas)
}
function deltaVChange(goods: goodsInfoType){
    goods.quan = (goods.base as number) + deltas[goods.key]
}
</script>
