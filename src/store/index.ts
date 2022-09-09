import { reactive, watchEffect, version } from 'vue'
import * as defaultCompiler from 'vue/compiler-sfc'
import { compileFile, File } from '@vue/repl'
import { utoa, atou } from '../utils/index'
import type { Store, SFCOptions, StoreState, OutputModes } from '@vue/repl'
import { defaultMainFile } from '../utils/code'

const publicPath = 'https://cdn.jsdelivr.net/npm/fighting-design/'

// const defaultMainFile = 'App.vue'
const varletReplPlugin = 'fighting-design-plugin.js'
const varletImports = {
  'fighting-design': `${publicPath}es/index.mjs`
}
const varletCss = `${publicPath}dist/index.css`

const welcomeCode = `\
<script setup lang='ts'>
import { ref } from 'vue'
import { installFightingDesign } from './${varletReplPlugin}'

installFightingDesign()

const msg = ref('Hello World！')
</script>

<template>
  <h1>欢迎使用 Fighting Design！</h1>
  <f-button type="primary">{{ msg }}</f-button>
</template>
`

const varletReplPluginCode = `\
import FightingDesign from 'fighting-design'

import { getCurrentInstance } from 'vue'

await appendStyle()

export function installFightingDesign() {
  const instance = getCurrentInstance()
  instance.appContext.app.use(FightingDesign)
}

export function appendStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '${varletCss}'
    link.onload = resolve
    link.onerror = reject
    document.body.appendChild(link)
  })
}
`

export class ReplStore implements Store {
  state: StoreState
  compiler = defaultCompiler
  options?: SFCOptions
  initialShowOutput: boolean
  initialOutputMode: OutputModes = 'preview'
  private readonly defaultVueRuntimeURL: string

  constructor ({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`,
    showOutput = false,
    outputMode = 'preview'
  }: {
    serializedState?: string
    showOutput?: boolean
    // loose type to allow getting from the URL without inducing a typing error
    outputMode?: OutputModes | string
    defaultVueRuntimeURL?: string
  }) {
    let files: StoreState['files'] = {}

    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      console.log(Object.keys(saved))
      for (const filename of Object.keys(saved)) {
        files[filename] = new File(filename, saved[filename])
      }
    } else {
      files = {
        [defaultMainFile]: new File(defaultMainFile, welcomeCode)
      }
    }

    console.log(files)

    this.defaultVueRuntimeURL = defaultVueRuntimeURL
    this.initialShowOutput = showOutput
    this.initialOutputMode = outputMode as OutputModes

    let mainFile = defaultMainFile
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0]
    }
    this.state = reactive({
      mainFile,
      files,
      activeFile: files[mainFile],
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL,
      fightingDesign: `${publicPath}es/index.mjs`
    }) as unknown as StoreState

    this.initImportMap()

    // varlet inject
    this.state.files[varletReplPlugin] = new File(varletReplPlugin, varletReplPluginCode, !import.meta.env.DEV)

    watchEffect(() => compileFile(this, this.state.activeFile))

    for (const file in this.state.files) {
      if (file !== defaultMainFile) {
        compileFile(this, this.state.files[file])
      }
    }
  }

  setActive = (filename: string): void => {
    this.state.activeFile = this.state.files[filename]
  }

  // don't start compiling until the options are set
  init = (): void => {
    watchEffect(() => compileFile(this, this.state.activeFile))
    for (const file in this.state.files) {
      if (file !== defaultMainFile) {
        compileFile(this, this.state.files[file])
      }
    }
  }

  addFile = (fileOrFilename: string | File): void => {
    const file = typeof fileOrFilename === 'string' ? new File(fileOrFilename) : fileOrFilename
    this.state.files[file.filename] = file
    if (!file.hidden) this.setActive(file.filename)
  }

  deleteFile = (filename: string): void => {
    if (filename === varletReplPlugin) {
      alert('Varlet depends on this file')
      return
    }

    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        this.state.activeFile = this.state.files[this.state.mainFile]
      }
      delete this.state.files[filename]
    }
  }

  serialize = (): string => {
    return '#' + utoa(JSON.stringify(this.getFiles()))
  }

  getFiles = (): Record<string, string> => {
    const exported: Record<string, string> = {}
    for (const filename in this.state.files) {
      exported[filename] = this.state.files[filename].code
    }
    return exported
  }

  setFiles = async (newFiles: Record<string, string>, mainFile = defaultMainFile): Promise<void> => {
    const files: Record<string, File> = {}
    if (mainFile === defaultMainFile && !newFiles[mainFile]) {
      files[mainFile] = new File(mainFile, welcomeCode)
    }
    for (const [filename, file] of Object.entries(newFiles)) {
      files[filename] = new File(filename, file)
    }
    for (const file of Object.values(files)) {
      await compileFile(this, file)
    }
    this.state.mainFile = mainFile
    this.state.files = files
    this.initImportMap()
    this.setActive(mainFile)
  }

  private initImportMap = (): void => {
    const map = this.state.files['import-map.json']
    if (!map) {
      this.state.files['import-map.json'] = new File(
        'import-map.json',
        JSON.stringify(
          {
            imports: {
              vue: this.defaultVueRuntimeURL,
              ...varletImports
            }
          },
          null,
          2
        )
      )
    } else {
      try {
        const json = JSON.parse(map.code)
        if (!json.imports.vue) {
          json.imports.vue = this.defaultVueRuntimeURL
          map.code = JSON.stringify(json, null, 2)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  getImportMap = (): void | object => {
    try {
      return JSON.parse(this.state.files['import-map.json'].code)
    } catch (e) {
      this.state.errors = [`Syntax error in import-map.json: ${(e as Error).message}`]
      return {}
    }
  }
}
