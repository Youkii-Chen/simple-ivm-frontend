<template>

    <a-button @click="$emit('click')" style="background-color: #74b9ff;" shape="circle" size="large">
        <template #icon>
            <plus-outlined style="color: #ecf0f1;" />
        </template>
    </a-button>

</template>
<script lang="ts">
import { defineComponent } from "vue"

import { PlusOutlined } from '@ant-design/icons-vue'



export default defineComponent({
    emits: ['click'],
    components: {
        PlusOutlined
    }
})
</script>
