import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { IBannerType } from '~/assets/interfaces/parsing/Banner'
import { Dict } from '~/assets/types'

@Module({
  name: 'EEWInfoModule',
  stateFactory: true,
  namespaced: true,
})
export default class EEWInfoModule extends VuexModule {
  eewReceiveTime = 'XXXX/XX/XX XX:XX'
  eewReportNum = ''
  eewIsDrill = false
  eewIsExpected = false
  eewType = 'Fetching'
  eewAdvice = 'Fetching'

  eewTypesBanner: Dict<IBannerType> = {
    PLUM: {
      text:
        'PLUM determined epicenter - ' + 'No detailed information available',
      className: 'info-background',
    },
    Forecast: {
      text: 'Earthquake Early Warning (Forecast)',
      className: 'info-background',
    },
    Warning: {
      text: 'Earthquake Early Warning (Warning) - Strong Shaking Expected',
      className: 'intensity-8',
    },
    Fetching: {
      text: 'Fetching information...',
      className: 'info-background',
    },
  }

  eewAdviceBanner: Dict<IBannerType> = {
    StayAway: {
      text: 'Stay away from coastal areas',
      className: 'intensity-7',
    },
    PayAttention: {
      text: 'Pay attention to coastal areas',
      className: 'intensity-2',
    },
    Deep: {
      text: 'Deep earthquake - Information may not be accurate',
      className: 'deep-earthquake',
    },
    Wait: {
      text: 'Wait for further information',
      className: 'info-background',
    },
    Fetching: {
      text: 'Fetching information...',
      className: 'info-background',
    },
  }

  get getEEWReceiveTime() {
    return this.eewReceiveTime
  }

  get getEEWReportNum() {
    return this.eewReportNum
  }

  get getEEWIsDrill() {
    return this.eewIsDrill
  }

  get getEEWIsExpected() {
    return this.eewIsExpected
  }

  get getEEWType(): IBannerType {
    if (!(this.eewType in this.eewTypesBanner)) {
      throw new Error('Exhaustive handling of EEWType')
    } else {
      return this.eewTypesBanner[this.eewType]
    }
  }

  get getEEWAdvice(): IBannerType {
    if (!(this.eewAdvice in this.eewAdviceBanner)) {
      throw new Error('Exhaustive handling of EEWAdvice')
    } else {
      return this.eewAdviceBanner[this.eewAdvice]
    }
  }

  @Mutation
  setEEWReceiveTime(receiveTime: string) {
    this.eewReceiveTime = receiveTime
  }

  @Mutation
  setEEWReportNum(reportNum: string) {
    this.eewReportNum = reportNum
  }

  @Mutation
  setEEWDrill(isDrill: boolean) {
    this.eewIsDrill = isDrill
  }

  @Mutation
  setEEWExpected(isExpectedInt: boolean) {
    this.eewIsExpected = isExpectedInt
  }

  @Mutation
  setEEWType(eewType: string) {
    this.eewType = eewType
  }

  @Mutation
  setEEWAdvice(eewAdvice: string) {
    this.eewAdvice = eewAdvice
  }
}
