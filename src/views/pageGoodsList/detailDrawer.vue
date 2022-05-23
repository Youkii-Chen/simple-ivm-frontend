<template>
    <a-drawer title="货物详情" width="100vw" :visible="open" placement="right" @close="open = false">
        <template #extra>
            <a-button style="margin-right: 8px;" type="primary"
                @click="isNew ? store.dispatch('add', currentItem) : store.dispatch('update', currentItem); open = !open">
                保存</a-button>
            <a-popconfirm title="确定要删除吗?" ok-text="是的" cancel-text="算了"
                @confirm="store.dispatch('del', currentItem); open = !open">
                <a-button :disabled="$props.isNew" type="danger">删除</a-button>
            </a-popconfirm>
        </template>
        <a-form :model="currentItem">
            <a-form-item label="货物品名">
                <a-input v-model:value="currentItem.name" />
            </a-form-item>
            <a-form-item label="货物数量">
                <a-row type="flex" align="middle" :wrap="false">
                    <a-col flex="auto">
                        <a-input-number style="width: 100%; box-sizing: border-box;" v-model:value="currentItem.quan"
                            @change="quanModified" />
                    </a-col>
                    <a-col style="margin-left: 16px;margin-right: 8px;min-width: 2rem;">变动:</a-col>
                    <a-col>
                        <a-input-number style="width:85px;" :disabled="$props.isNew" v-model:value="quanDelta"
                            @change="deltaModified" />
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item label="货物单位">
                <!-- <a-input v-model:value="currentItem.unit" /> -->
                <a-auto-complete
                    v-model:value="currentItem.unit"
                    placeholder="输入货物单位..."
                    :options="units"
                ></a-auto-complete>
            </a-form-item>
            <a-form-item label="备注">
                <a-textarea placeholder="暂时没有备注哦~" :rows="8" v-model:value="currentItem.mark" />
            </a-form-item>

        </a-form>
    </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue"
import { useStore } from "../../store"
import type { goodsInfoType } from '../../types'

export default defineComponent({
    props: {
        isNew: {
            default: false
        }
    },
    setup() {
        const store = useStore()
        const currentItem = reactive<goodsInfoType>({
            key: 0,
            name: '',
            quan: 0,
            mark: '',
            unit: '',
        })

        const units_ = [{value: '千克'},{value: '斤'},{value: '个'},{value: '箱'},{value: '盒'},{value: '排'},{value: '两'}]
        const open = ref(false)
        const quanDelta = ref(0)
        const baseQuan = ref(0)

        const deltaModified = () => {
            // 偏移栏目的值被修改
            currentItem.quan = baseQuan.value + quanDelta.value
        }
        const quanModified = () => {
            quanDelta.value = currentItem.quan - baseQuan.value
        }

        const units = computed(() => {
            for (let item of store.state.goods){
                if (units_.findIndex(e => e.value === item.unit) >= 0){
                    continue
                }else{
                    units_.push({value: item.unit})
                }
                
            }
            return units_
        })

        return {
            quanDelta,
            currentItem: currentItem,
            open,
            baseQuan,
            deltaModified,
            quanModified,
            store,
            units
        }
    }
})

</script>
