import { SSR_STATE_KEY } from 'di/application'

import { SsrState } from './ssr-state'

declare const window: Window & { [SSR_STATE_KEY]?: Record<string, never> }

export const ssrStateFactory = (): SsrState => new SsrState(
  typeof window !== 'undefined'
    ? window[SSR_STATE_KEY]
    : undefined,
)

