import Vue from 'vue'

import { mixinForVue2 } from './mixin-for-vue2'

function installVue2 (vue): void {
  if (vue.prototype._modelerIntalled) {
    return
  }

  vue.prototype._modelerIntalled = true
  vue.mixin(mixinForVue2)
}

export function modelerPlugin (app: typeof Vue): void {
  installVue2(app)
}

