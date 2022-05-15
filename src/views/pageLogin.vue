<template>
    <a-form :model="formData" name="basic" autocomplete="off"
        @finish="onFinish">
        <a-form-item label="用户名" name="username"
            :rules="[{ required: true, message: '请输入用户名!' }]">
            <a-input v-model:value="formData.userName" />
        </a-form-item>

        <a-form-item label="用户密码" name="password"
            :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password v-model:value="formData.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 16 }">
            <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
    import type { userInfo } from '../types';
    import { ref, reactive } from 'vue'
    const formData = reactive<userInfo>({
        userName: '',
        password: ''
    })

    const onFinish = (value: object) => {
        console.log("登录: ", value)
    }
</script>
