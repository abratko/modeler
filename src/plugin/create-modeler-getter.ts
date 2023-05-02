import { ModelDescriptorCollection } from '../types'
import { ModelDescriptors } from './model-descriptors'

export const createModelerGetter = (): { readonly modeler: ModelDescriptorCollection } => {
  let modeler: ModelDescriptors

  return {
    get modeler (): ModelDescriptorCollection {
      if (!modeler) {
        modeler = new ModelDescriptors()
      }

      return modeler
    },
  }
}
