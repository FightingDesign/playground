export const defaultCode = ''

export const defaultFile = 'App.vue'

export const setupFightingDesign = 'fighting.js'

export const fightingDesignCode = `
import FightingDesign from 'fighting-design'
import 'fighting-design/dist/index.css'

const install = (app) => {
  app.use(FightingDesign)
}
`
