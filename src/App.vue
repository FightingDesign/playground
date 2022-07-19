<script lang="ts" setup>
  import { Repl } from '@vue/repl'
  import '@vue/repl/style.css'
  import Header from './components/Header.vue'
</script>

<template>
  <Header />
  <Repl />
</template>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
</style>

<style lang="scss" scoped></style>
