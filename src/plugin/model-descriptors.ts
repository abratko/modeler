import {
  ModelAbstract,
  ModelConstructor,
  ModelDescriptor,
  ModelDescriptorCollection,
} from '../types'

export class ModelDescriptors implements ModelDescriptorCollection {
  protected items = new Map()

  get size (): number {
    return this.items.size
  }

  delete<Model extends ModelAbstract> (key: ModelConstructor<Model>): boolean {
    return this.items.delete(key)
  }

  get<Model extends ModelAbstract> (key: ModelConstructor<Model>): ModelDescriptor<Model> | undefined {
    return this.items.get(key)
  }

  set<Model extends ModelAbstract> (key: ModelConstructor<Model>, value: ModelDescriptor<Model>): this {
    this.items.set(key, value)

    return this
  }
}

