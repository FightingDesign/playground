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
