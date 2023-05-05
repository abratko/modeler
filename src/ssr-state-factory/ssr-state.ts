export class SsrState {
  readonly key = 'ssrState'
  readonly isServer: boolean = true
  protected serializers: Record<string, () => unknown> = {}
  protected stateFromServer: Record<string, never> = {}

  constructor (stateFromServer?: Record<string, never>) {
    if (stateFromServer) {
      this.stateFromServer = stateFromServer[this.key] || {}
    }

    this.isServer = typeof window === 'undefined'
  }

  extract<Model> (key: string): Model | undefined {
    let state

    if (this.stateFromServer[key]) {
      state = this.stateFromServer[key]
      delete this.stateFromServer[key]
    }

    return state
  }

  onSerializeState<SerializationResult> (key: string, serializer: () => SerializationResult): void {
    this.serializers[key] = serializer
  }

  serialize (): object {
    const state = {}
    for (const key in this.serializers) {
      if (!this.serializers[key]) {
        continue
      }

      state[key] = this.serializers[key]()
    }

    return state
  }
}

