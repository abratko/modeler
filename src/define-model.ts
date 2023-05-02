import { effectScope, getCurrentInstance, onScopeDispose } from 'vue'

import { ModelAbstract, ModelConstructor } from './types'

export function defineModel<Model extends ModelAbstract> (
  modelConstructor: ModelConstructor<Model>,
): () => Model {
  return (): Model => {
    const currentInstance = getCurrentInstance()?.proxy
    const modeler = currentInstance?.$modeler

    if (!modeler) {
      throw new Error('Model layer undefined. Check plugin setup')
    }

    let modelDescriptor = modeler.get<Model>(modelConstructor)

    if (!modelDescriptor) {
      const scope = effectScope(true)
      const instance = scope.run<Model>(modelConstructor)

      if (!instance) {
        throw new Error('Factory has not created model instance')
      }

      modelDescriptor = {
        scope,
        instance,
        countSubscribers: 0,
      }

      modeler.set(modelConstructor, modelDescriptor)
    }

    modelDescriptor.countSubscribers++

    onScopeDispose(() => {
      if (!modelDescriptor) {
        throw new Error('Model descriptor undefined')
      }

      if (--modelDescriptor.countSubscribers > 0) {
        return
      }

      modelDescriptor.scope.stop()
      modeler.delete(modelConstructor)
    })

    return modelDescriptor.instance
  }
}
