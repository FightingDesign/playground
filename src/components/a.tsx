import { h, version } from 'vue'
import { Repl, ReplStore } from '@vue/repl'

export const App = {
  setup () {
    const store = new ReplStore({
      defaultVueRuntimeURL: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.js`
    })

    const sfcOptions = {
      script: {
        reactivityTransform: true
      }
    }
    return () => {
      const file = `<script setup>
        import { ref } from 'vue'
        
        const msg = ref('hello world!')
        </script>
        
        <template>
          <h1>{{ msg }}</h1>
          <input v-model="msg">
        </template>`
      store.setFiles({
        'App.vue': file
      })

      return h(Repl, {
        store: store,
        showCompileOutput: true,
        autoResize: true,
        sfcOptions: sfcOptions,
        clearConsole: false
      })
    }
  }
}
