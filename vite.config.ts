import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// vite.config.js
import {
  AntDesignVueResolver,
} from "unplugin-vue-components/resolvers";


export default defineConfig({
  base: '/ui/',
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ]
})

