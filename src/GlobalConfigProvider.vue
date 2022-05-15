<template>
  <a-config-provider :locale="locale">
    <App />
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { defineComponent } from 'vue';
import App from "./App.vue"
dayjs.locale('zh-cn');


export default defineComponent({
  components: {
    App,
  },
  setup(){
    return {
      locale: zhCN,
    };
  }
});
</script>