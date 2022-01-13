import { Dict } from '~/assets/types'

export interface IGeoJsonData {
  countries?: object
  japan?: object
  japanWithSubAreas?: object
}

export interface IFetchGeoJsonConfig {
  countries?: boolean
  japan?: boolean
  japanWithSubAreas?: boolean
}

export interface IAreaColor {
  colors: Dict<string>
  areas: string[]
}

export interface IGeoJsonFeature {
  type: string
  properties: Dict<string>
  geometry: any
}
