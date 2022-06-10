<template>

    <a-button @click="$emit('open')" style="background-color: #74b9ff;" shape="circle" size="large">
        <template #icon>
            <plus-outlined style="color: #ecf0f1;" />
        </template>
    </a-button>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
const emits = defineEmits(['open', ])
</script>
