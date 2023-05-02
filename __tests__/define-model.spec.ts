import { createLocalVue, mount, Wrapper } from '@vue/test-utils'

import { defineModel } from '../src/define-model'
import { ModelDescriptors } from '../src/plugin/model-descriptors'
import { modelerPlugin } from '../src/plugin/modeler-plugin'

const modelInstanceFixture = {}
const modelFactoryMock = jest.fn().mockReturnValue(modelInstanceFixture)
const invalidModelFactoryMock = jest.fn().mockReturnValue(null)

const useModel = defineModel(modelFactoryMock)
const useInvalidModel = defineModel(invalidModelFactoryMock)

const stubComponent = {
  props: ['modelFactory'],
  // eslint-disable-next-line
  setup (props) {
    return {
      model: props.modelFactory(),
    }
  },
  template: '<div>I am stub</div>',
}

describe('useModel', () => {
  const localVue = createLocalVue()

  test('has thrown error because modeler plugin not installed', () => {
    jest.spyOn(console, 'error')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.error.mockImplementation(() => null)

    expect(() => mount(
      stubComponent,
      {
        localVue,
        propsData: {
          modelFactory: useModel,
        },
        modeler: new ModelDescriptors(),
      },
    )).toThrow(new Error('Model layer undefined. Check plugin setup'))

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.error.mockRestore()
  })
})

describe('useModel', () => {
  const localVue = createLocalVue()

  beforeAll(() => {
    localVue.use(modelerPlugin)
  })

  it('has thrown error because model factory did`t returned instance', () => {
    jest.spyOn(console, 'error')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.error.mockImplementation(() => null)
    const modelerStub = new ModelDescriptors()

    expect(() => mount(
      stubComponent,
      {
        localVue,
        propsData: {
          modelFactory: useInvalidModel,
        },
        modeler: modelerStub,
      },
    )).toThrow(new Error('Factory has not created model instance'))

    expect(invalidModelFactoryMock.mock.calls.length).toBe(1)
    expect(modelerStub.size).toBe(0)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.error.mockRestore()
  })

  describe('called multiple time ', () => {
    // eslint-disable-next-line
    const wrappers: Array<Wrapper<any>> = []
    const modelerStub = new ModelDescriptors()

    beforeAll(() => {
      let i = 0
      for (; i < 3; i++) {
        const wrapper = mount(
          stubComponent,
          {
            localVue,
            propsData: {
              modelFactory: useModel,
            },
            modeler: modelerStub,
          },
        )

        wrappers.push(wrapper)
      }
    })

    it('single instance has been created and countSubscribes has been increased', () => {
      for (const wrapper of wrappers) {
        // eslint-disable-next-line
        expect(wrapper.getComponent(stubComponent).vm['model']).toBe(modelInstanceFixture)
      }

      expect(modelFactoryMock.mock.calls.length).toBe(1)
      expect(modelerStub.size).toBe(1)

      const modelDescriptor = modelerStub.get(modelFactoryMock)
      expect(modelDescriptor?.countSubscribers).toBe(wrappers.length)
      expect(modelDescriptor?.instance).toBe(modelInstanceFixture)
    })

    it('after destroyed components model descriptor storage had been clean', () => {
      for (const wrapper of wrappers) {
        wrapper.destroy()
      }

      expect(modelerStub.size).toBe(0)
    })
  })
})

