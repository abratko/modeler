import { ModelDescriptorCollection, ModelerPlugin } from '../types'
import { ModelDescriptors } from './model-descriptors'

export const createModeler = (): ModelerPlugin => {
  let modelDescriptors: ModelDescriptors

  return {
    get modelDescriptors (): ModelDescriptorCollection {
      if (!modelDescriptors) {
        modelDescriptors = new ModelDescriptors()
      }

      return modelDescriptors
    },
  }
}
