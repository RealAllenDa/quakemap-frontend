import { Module, VuexModule } from 'vuex-module-decorators'
import { Dict } from '~/assets/types'
import { IIconConfig } from '~/assets/interfaces/parsing/Intensities'

@Module({
  name: 'IntensityConfigModule',
  stateFactory: true,
  namespaced: true,
})
export default class IntensityConfigModule extends VuexModule {
  intensityConversionInterfaces: Dict<IIconConfig> = {
    '1': {
      class: '1',
      isAddOrMinus: false,
      text: '1',
      addText: '',
      zIndex: 100,
    },
    '2': {
      class: '2',
      isAddOrMinus: false,
      text: '2',
      addText: '',
      zIndex: 200,
    },
    '3': {
      class: '3',
      isAddOrMinus: false,
      text: '3',
      addText: '',
      zIndex: 300,
    },
    '4': {
      class: '4',
      isAddOrMinus: false,
      text: '4',
      addText: '',
      zIndex: 400,
    },
    '5-': {
      class: '5',
      isAddOrMinus: true,
      text: '5',
      addText: '-',
      zIndex: 500,
    },
    '5+': {
      class: '6',
      isAddOrMinus: true,
      text: '5',
      addText: '+',
      zIndex: 600,
    },
    '6-': {
      class: '7',
      isAddOrMinus: true,
      text: '6',
      addText: '-',
      zIndex: 700,
    },
    '6+': {
      class: '8',
      isAddOrMinus: true,
      text: '6',
      addText: '+',
      zIndex: 800,
    },
    '7': {
      class: '9',
      isAddOrMinus: false,
      text: '7',
      addText: '',
      zIndex: 900,
    },
    '5?': {
      class: '5_and_up',
      isAddOrMinus: true,
      text: '5',
      addText: '?',
      zIndex: 50,
      specialIntensity: true,
    },
  }

  intensityConversionColors: Dict<string> = {
    '0': '#666666',
    '1': '#46646E',
    '2': '#1E6EE6',
    '3': '#00C8C8',
    '4': '#FAFA64',
    '5-': '#FFB400',
    '5+': '#FF7800',
    '5?': '#FFFF00',
    '6-': '#E60000',
    '6+': '#A00000',
    '7': '#960096',
  }

  get intensityColors() {
    return this.intensityConversionColors
  }

  get intensityConversion() {
    return this.intensityConversionInterfaces
  }
}
