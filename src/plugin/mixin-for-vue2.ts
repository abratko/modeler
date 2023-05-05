export const mixinForVue2 = {
  beforeCreate (): void {
    if (this.$options.modeler) {
      this.$modeler = this.$options.modeler.modelDescriptors

      return
    }

    // this code is copy from other plugins: router, pinia.
    // I don`t know why i should assign "this" to $modeler if this.$options.parent.$modeler is empty
    this.$modeler = (this.$options.parent && this.$options.parent.$modeler) || this
  },
}
