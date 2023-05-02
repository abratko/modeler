import { EffectScope } from 'vue'

export interface ModelStateSerialized {
  key: string
  value: string
}

export type ModelAbstract = object

export interface ModelDescriptor<Model extends ModelAbstract> {
  scope: EffectScope
  instance: Model
  countSubscribers: number
}

export interface ModelConstructor<Model extends ModelAbstract> {
  (): Model
}

export interface ModelDescriptorCollection {
  readonly size: number

  set: <Model extends ModelAbstract>(
    key: ModelConstructor<Model>,
    value: ModelDescriptor<Model>
  ) => this
  get: <Model extends ModelAbstract>(key: ModelConstructor<Model>) => ModelDescriptor<Model> | undefined
  delete: <Model extends ModelAbstract>(key: ModelConstructor<Model>) => boolean
}

export interface ModelDescriptorCollectionConstructor {
  new (): ModelDescriptorCollection
}

export interface SsrState {
  set: (
    key: string,
    value: string | number | null
  ) => this
  extract: (key: string) => string | number | null | undefined
}

export interface ModelerPlugin {
  readonly modelDescriptors: ModelDescriptorCollection
}
