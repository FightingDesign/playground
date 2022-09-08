import { createApp } from 'vue'
import App from './App.vue'
import FightingDesign from 'fighting-design'
import 'fighting-design/dist/index.css'

console.clear = (): string => ''

createApp(App).use(FightingDesign).mount('#app')
