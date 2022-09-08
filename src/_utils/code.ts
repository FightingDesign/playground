export const defaultCode = `
<script setup>
  import { ref } from 'vue'

  const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
  <f-button>{{ msg }}</f-button>
</template>
`

export const defaultFile = 'App.vue'

export const setupFightingDesign = 'fighting.js'

export const fightingDesignCode = `
import FightingDesign from 'fighting-design'
import 'fighting-design/dist/index.css'

const install = (app) => {
  app.use(FightingDesign)
}
`
