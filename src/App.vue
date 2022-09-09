<script setup lang="ts">
  import HeaderVue from './components/Header.vue'
  import { ReplStore } from './store/vStore'
  import { watchEffect } from 'vue'
  import { Repl } from '@vue/repl'

  const store = new ReplStore({
    serializedState: location.hash.slice(1),
    defaultVueRuntimeURL:
      'https://cdn.jsdelivr.net/npm/vue/dist/vue.esm-browser.js'
  })

  // enable experimental features
  // const sfcOptions = {
  //   script: {
  //     reactivityTransform: true
  //   }
  // }

  // persist state
  watchEffect(() => history.replaceState({}, '', store.serialize()))
</script>

<template>
  <header-vue />
  <!-- <repl
    :store="store"
    :show-compile-output="true"
    :auto-resize="true"
    :sfc-options="sfcOptions"
    :clear-console="false"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
  /> -->

  <repl :store="store" show-compile-output />
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
    --color-branding: #5580f8 !important;
    --color-branding-dark: #5580f8 !important;

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
