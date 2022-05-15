<template>
    <a-drawer title="货物详情" width="100vw" :visible="open" placement="right" @close="open = false">
        <a-form :model="currnetItem">
            <a-form-item label="货物品名">
                <a-input v-model:value="currnetItem.name" />
            </a-form-item>
            <a-form-item label="货物数量">
                <a-row type="flex" align="middle" :wrap="false">
                    <a-col flex="auto" >
                        <a-input-number style="width: 100%; box-sizing: border-box;" v-model:value="currnetItem.quan" @change="quanModified" />
                    </a-col>
                    <a-col style="margin-left: 16px;margin-right: 8px;min-width: 2rem;">变动:</a-col>
                    <a-col>
                        <a-input-number style="width:85px;" :disabled="$props.isNew" v-model:value="quanDelta" @change="deltaModified" />
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item label="货物单位">
                <a-input v-model:value="currnetItem.unit" />
            </a-form-item>
            <a-form-item label="备注">
                <a-textarea placeholder="暂时没有备注哦~" :rows="8" v-model:value="currnetItem.mark" />
            </a-form-item>



        </a-form>
        
        <a-button style="margin-right: 8px;" type="primary" @click="itemModifySubmit">保存</a-button>
        <a-popconfirm title="确定要删除吗?" ok-text="是的" cancel-text="算了" @confirm="goods.del(currnetItem)">
            <a-button :disabled="$props.isNew" type="danger">删除</a-button>
        </a-popconfirm>


    </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from "vue"
import { useStore } from "../../store"
import { goods } from "../../requests"
import type { goodsInfoType } from '../../types'
import { bool } from "vue-types"

export default defineComponent({
    props: {
        isNew: {
            default: false
        }
    },
    setup(props) {
        const store = useStore()
        const currnetItem = reactive<goodsInfoType>({
            key: 0,
            name: '',
            quan: 0,
            mark: '',
            unit: '',
        })

        const open = ref(false)
        const quanDelta = ref(0)
        const baseQuan = ref(0)

        const deltaModified = () => {
            // 偏移栏目的值被修改
            currnetItem.quan = baseQuan.value + quanDelta.value
        }
        const quanModified = () => {
            quanDelta.value = currnetItem.quan - baseQuan.value
        }

        const itemModifySubmit = () => {
            // console.log(currnetItem)
            console.log(props.isNew)
        }

        return {
            quanDelta,
            itemModifySubmit,
            currnetItem,
            open,
            baseQuan,
            deltaModified,
            quanModified,
            store,
            goods
        }
    }
})

</script>
