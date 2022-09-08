<!-- <script setup lang="ts">
import { Repl } from '@vue/repl'
import { watchEffect } from 'vue'
 
import { ReplStore } from './store'
 
const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + 'px')
}
window.addEventListener('resize', setVH)
setVH()
const store = new ReplStore({
  serializedState: location.hash.slice(1)
})
 
const sfcOptions = {
  script: {
    reactivityTransform: true
  }
}
 
watchEffect(() => history.replaceState({}, '', store.serialize()))
</script>
 
<template>
  <repl
    :store="store"
    :show-compile-output="true"
    :auto-resize="true"
    :sfc-options="sfcOptions"
    :clear-console="false"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
  /> 
</template>

<style>
body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  --base: #444;
  --nav-height: 50px;
}
 
.vue-repl {
  height: calc(var(--vh) - var(--nav-height));
}
 
button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
  -->
<script lang="ts" setup>
  import '@vue/repl/style.css'
  import HeaderVue from './components/Header.vue'
  import { watchEffect } from 'vue'
  import { Repl, ReplStore } from '@vue/repl'
  import { defaultCode } from './_utils/code'

  // 从URL检索一些配置选项
  const query = new URLSearchParams(location.search)

  const store = new ReplStore({
    // 使用以前序列化的状态初始化 repl
    serializedState: location.hash.slice(1),

    // 如果URL具有showOutput查询，则从输出窗格（仅限移动设备）开始
    showOutput: query.has('showOutput'),
    // 如果URL具有outputMode查询，则从输出窗格的其他选项卡开始
    // 并默认为“预览”选项卡
    outputMode: query.get('outputMode') || 'preview',

    // 在沙盒中指定要从中导入Vue运行时的默认URL
    // 默认为unpkg的CDN链接。版本与Vue版本匹配的com
    // 来自对等依赖
    defaultVueRuntimeURL:
      'https://cdn.jsdelivr.net/npm/vue/dist/vue.esm-browser.js'
  })

  // const sfcOptions = {
  //   script: {
  //     reactivityTransform: true
  //   }
  // }

  store.setFiles({
    'App.vue': defaultCode
    // 'fighting-design':
    //   'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/es/index.mjs',
    // 'fighting-design-theme':
    //   'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/dist/index.css'
  })

  // store.state['fighting-design'] =
  //   'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/es/index.mjs'
  // store.state['fighting-design-theme'] =
  //   'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/dist/index.css'

  // 将状态持久化到 URL 哈希
  watchEffect(() => history.replaceState({}, '', store.serialize()))

  const importMap = {
    imports: {
      // cdn link to esm build of myLib
      // myLib: 'https://cdn.jsdelivr.net/npm/fighting-design/dist/index.umd.js'
      // myLib:
      //   'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/es/index.mjs'
      'fighting-design':
        'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/es/index.mjs',
      'fighting-design-theme':
        'https://cdn.jsdelivr.net/npm/fighting-design@0.6.4-alpha.5/dist/index.css'
    }
  }

  // 预设导入映射
  store.setImportMap(importMap)

  // console.log(genVueLink())

  // 使用特定版本的Vue
  store.setVueVersion('3.2.36')

  console.log(store)
</script>

<template>
  <header-vue />
  <repl :store="store" show-compile-output />
</template>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  .vue-repl {
    position: fixed;
    top: 55px;
    right: 0;
    bottom: 0;
    left: 0;

    .file.active {
      color: #2d5af1;
      border-bottom: 3px solid #2d5af1;
      .label {
        color: #2d5af1;
      }
    }

    .active {
      border-bottom: 3px solid #2d5af1 !important;

      span {
        color: #2d5af1;
      }
    }
  }
</style>
