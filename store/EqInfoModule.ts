import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import {
  IHypocenter,
  ITsunamiComments,
} from '~/assets/interfaces/parsing/QuakeInfo'

@Module({
  name: 'EqInfoModule',
  stateFactory: true,
  namespaced: true,
})
export default class EqInfoModule extends VuexModule {
  // TODO: Remove default options
  hypocenterInfo: IHypocenter = {
    name: '---',
    depth: '---',
    latitude: -999,
    longitude: -999,
  }

  maximumIntensity = '--'
  occurTime = 'XXXX/XX/XX XX:XX'
  magnitude = '---'
  currentType = 'Unknown'
  tsunamiCommentsDomestic = 'Fetching'
  tsunamiCommentsForeign = 'Fetching'

  get tsunamiComments(): ITsunamiComments {
    return {
      domestic: this.tsunamiCommentsDomestic,
      foreign: this.tsunamiCommentsForeign,
    }
  }

  get getMaxInt(): string {
    return this.maximumIntensity
  }

  get getCurrentType(): string {
    return this.currentType
  }

  get getOccurTime(): string {
    return this.occurTime
  }

  get getHypocenter(): IHypocenter {
    return this.hypocenterInfo
  }

  get getMagnitude(): string {
    return this.magnitude
  }

  @Mutation
  setHypocenter(hypocenter: IHypocenter) {
    this.hypocenterInfo = hypocenter
  }

  @Mutation
  setMaxIntensity(maxInt: string) {
    this.maximumIntensity = maxInt
  }

  @Mutation
  setOccurTime(occurTime: string) {
    this.occurTime = occurTime
  }

  @Mutation
  setMagnitude(magnitude: string) {
    this.magnitude = magnitude
  }

  @Mutation
  setCurrentInfoType(infoType: string) {
    this.currentType = infoType
  }

  @Mutation
  setDomesticTsunamiComment(comment: string) {
    this.tsunamiCommentsDomestic = comment
  }

  @Mutation
  setForeignTsunamiComment(comment: string) {
    this.tsunamiCommentsForeign = comment
  }
}
