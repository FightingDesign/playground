import type { OutputModes, SFCOptions, Store, StoreState } from '@vue/repl'
import * as defaultCompiler from 'vue/compiler-sfc'
import type { StoreOptions } from './interface'
import { defaultFile, defaultCode } from './code'
// import { defaultCode, defaultFile, devuiCode, genImportsMap, setupDevui } from './code2'
import { decodeData, atou } from './utils'

// const filename = 'App.vue'

const getInitFiles = (serializedState = '') => {
  let files: StoreState['files'] = {}
  if (serializedState) {
    const saved = JSON.parse(atou(serializedState))
    for (const defaultFile in saved) {
      files[defaultFile] = new File([defaultFile], saved[defaultFile])
    }
  } else {
    files = {
      [defaultFile]: new File(defaultFile, defaultCode)
    }
  }

  // let files: StoreState['files'] = {
  //   [defaultFile]: new File([defaultFile], defaultCode)
  // }
  // if (serializedState) {
  //   console.log(serializedState)
  //   try {
  //     files = {}
  //     const res = JSON.parse(decodeData(serializedState))
  //     for (const filename of Object.keys(res)) {
  //       files[filename] = new File(filename, res[filename])
  //     }
  //   } catch (err) {
  //     console.log(err)
  //     console.log('Json parse error: src/repl-store/index.ts')
  //   }
  // }

  return files
}

const version = '3.2.38'

export class ReplStore implements Store {
  state: StoreState
  compiler = defaultCompiler
  vueVersion?: string
  options?: SFCOptions
  initialShowOutput: boolean
  initialOutputMode: OutputModes

  constructor ({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`,
    defaultVueServerRendererURL = `https://unpkg.com/@vue/server-renderer@${version}/dist/server-renderer.esm-browser.js`,
    showOutput = false,
    outputMode = 'preview'
  }: StoreOptions = {}) {
    const files = getInitFiles(serializedState)

    console.log(files)
    console.log(serializedState)

    this.defaultVueRuntimeURL = defaultVueRuntimeURL
    this.defaultVueServerRendererURL = defaultVueServerRendererURL
    this.initialShowOutput = showOutput
    this.initialOutputMode = outputMode as OutputModes

  }
}
