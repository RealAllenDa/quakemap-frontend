/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import MapConfigModule from '~/store/MapConfigModule'
import IntensityConfigModule from '~/store/IntensityConfigModule'
import GeoJsonModule from '~/store/GeoJsonModule'
import EqInfoModule from '~/store/EqInfoModule'
import EEWInfoModule from '~/store/EEWInfoModule'

// TODO: Add stores
let MapConfigStore: MapConfigModule
let IntensityConfigStore: IntensityConfigModule
let GeoJsonStore: GeoJsonModule
let EqInfoStore: EqInfoModule
let EEWInfoStore: EEWInfoModule

function initializeStores(store: Store<any>): void {
  // TODO
  MapConfigStore = getModule(MapConfigModule, store)
  IntensityConfigStore = getModule(IntensityConfigModule, store)
  GeoJsonStore = getModule(GeoJsonModule, store)
  EqInfoStore = getModule(EqInfoModule, store)
  EEWInfoStore = getModule(EEWInfoModule, store)
}

export {
  initializeStores,
  MapConfigStore,
  IntensityConfigStore,
  GeoJsonStore,
  EqInfoStore,
  EEWInfoStore,
}
