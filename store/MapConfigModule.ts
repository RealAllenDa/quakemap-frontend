import { Module, VuexModule } from 'vuex-module-decorators'
import { IMapConfig } from '~/assets/interfaces/parsing/Map'

@Module({
  name: 'MapConfigModule',
  stateFactory: true,
  namespaced: true,
})
export default class MapConfigModule extends VuexModule {
  mapOptions = {
    attributionControl: false,
    zoomControl: false,
    zoomSnap: 0.01,
    zoomDelta: 0.5,
    maxZoom: 8,
    minZoom: 2,
  }

  countriesBgStyle = {
    stroke: true,
    fill: true,
    fillColor: '#3a3a3a',
    fillOpacity: 1,
    weight: 1,
    color: '#3a3a3a',
  }

  japanBgStyle = {
    stroke: false,
    fill: true,
    fillColor: '#3a3a3a',
    fillOpacity: 1,
  }

  japanAreaBorderStyle = {
    stroke: true,
    fill: false,
    color: '#565656',
    weight: 0.5,
  }

  japanBorderStyle = {
    stroke: true,
    fill: false,
    color: '#838383',
    weight: 0.5,
  }

  sWaveCircleStyle = {
    color: '#E65A5A',
    weight: 2,
    opacity: 1,
    fillColor: '#E65A5A',
    fillOpacity: 0.2,
  }

  pWaveCircleStyle = {
    color: '#50A0FA',
    weight: 2,
    opacity: 1,
    fill: false,
  }

  get mapConfig(): IMapConfig {
    return {
      mapOptions: this.mapOptions,
      countriesBgStyle: this.countriesBgStyle,
      japanBgStyle: this.japanBgStyle,
      japanAreaBorderStyle: this.japanAreaBorderStyle,
      japanBorderStyle: this.japanBorderStyle,
      sWaveCircleStyle: this.sWaveCircleStyle,
      pWaveCircleStyle: this.pWaveCircleStyle,
    }
  }
}
