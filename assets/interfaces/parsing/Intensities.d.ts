/* eslint-disable camelcase */
import { Dict } from '~/assets/types'
import { IEEWAreaIntensity } from '~/assets/interfaces/parsing/EEW'

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

export interface IIntensities {
  areas?: Dict<_IIntensityAreas>
  station?: Dict<_IIntensityStations>
}

export type AllIntensities =
  | _IIntensityStations
  | _IIntensityAreas
  | IEEWAreaIntensity
