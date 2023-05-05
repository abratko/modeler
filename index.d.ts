import { ModelDescriptorCollection, ModelerPlugin } from './src/types'

declare module 'vue/types/vue' {
  interface Vue {
    $modeler: ModelDescriptorCollection
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V> {
    modeler?: ModelerPlugin
  }
}

