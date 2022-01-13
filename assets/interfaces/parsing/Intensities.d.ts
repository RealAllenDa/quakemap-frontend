/* eslint-disable camelcase */
import { Dict } from '~/assets/types'
import { IEEWAreaIntensity } from '~/assets/interfaces/parsing/EEW'
import { IMapIcon } from '~/assets/interfaces/parsing/MapIcon'

interface _IIntensityAreas {
  name: string
  intensity: string
  latitude: number
  longitude: number
  is_area: boolean
  intensity_code?: number
}

interface _IIntensityStations extends _IIntensityAreas {
  region_code: number
  region_name: string
}

interface _IIntensityIcon extends IMapIcon {
  addPlusOrMinus: boolean
  addText: string
  specialAdd?: boolean
}

export interface IMapIntensities {
  zIndex: number
  latitude: number
  longitude: number
  icon: _IIntensityIcon
}

export interface IIntensities {
  areas: Dict<_IIntensityAreas>
  station: Dict<_IIntensityStations>
}

export interface IIconConfig {
  // TODO: Add color config
  class: string
  isAddOrMinus: boolean
  text: string
  addText: string
  zIndex: number
  specialIntensity?: boolean
}

export type AllStationIntensities = Dict<_IIntensityStations>

export type AllAreaIntensities =
  | Dict<_IIntensityAreas>
  | Dict<IEEWAreaIntensity>
