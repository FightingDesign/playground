// 请求 CDN 的基础路径
export const publicPath = 'https://cdn.jsdelivr.net/npm/fighting-design/'

// 默认入口文件名
export const defaultMainFile = 'App.vue'

// Fighting-Design 配置文件名
export const fightingPlugin = 'fighting.ts'

// 引入 es 模块代码
export const fightingImports = {
  'fighting-design': `${publicPath}es/index.mjs`
}

export const fightingPluginCode = `
import FightingDesign from 'fighting-design'
import { getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'

export const install = () => {
  const instance = getCurrentInstance() as ComponentInternalInstance
  instance.appContext.app.use(FightingDesign)
}

const appendStyle = () => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '${publicPath}dist/index.css'
    link.onload = resolve
    link.onerror = reject
    document.body.appendChild(link)
  })
}

await appendStyle()
`

export const defaultCode = `
<script setup lang='ts'>
  import { ref } from 'vue'
  import { install } from './${fightingPlugin}'

  install()

  const msg = ref('Hello World！')
</script>

<template>
  <h1>欢迎使用 Fighting Design！</h1>
  <f-button type="primary">{{ msg }}</f-button>
</template>
`
