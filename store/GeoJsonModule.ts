import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { IGeoJsonData } from '~/assets/interfaces/parsing/GeoJson'

@Module({
  name: 'GeoJsonModule',
  stateFactory: true,
  namespaced: true,
})
export default class GeoJsonModule extends VuexModule {
  geoJson: IGeoJsonData = {}

  get countriesGeoJson(): object {
    return this.geoJson.countries!
  }

  get japanGeoJson(): object {
    return this.geoJson.japan!
  }

  get japanWithSubAreasGeoJson(): object {
    return this.geoJson.japanWithSubAreas!
  }

  @Mutation
  setCountriesGeoJson(geoJson: object) {
    this.geoJson.countries = geoJson
    Object.freeze(this.geoJson.countries)
  }

  @Mutation
  setJapanGeoJson(geoJson: object) {
    this.geoJson.japan = geoJson
    Object.freeze(this.geoJson.japan)
  }

  @Mutation
  setJapanSubAreasGeoJson(geoJson: object) {
    this.geoJson.japanWithSubAreas = geoJson
    Object.freeze(this.geoJson.japanWithSubAreas)
  }
}
