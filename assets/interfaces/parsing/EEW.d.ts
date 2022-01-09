/* eslint-disable camelcase */
import { _IIntensityAreas } from '~/assets/interfaces/parsing/Intensities'
import { Dict } from '~/assets/types'
import { IHypocenter } from '~/assets/interfaces/parsing/QuakeInfo'

interface IEEWAreaIntensity extends _IIntensityAreas {
  area_code: number
  detail_intensity: number
  sub_area_code: number
}

interface IEEWAreaColoring {
  areas: Dict<_IIntensityAreas>
  recommended_areas: boolean
}

export interface IEEW {
  area_coloring: IEEWAreaColoring
  area_intensity: Dict<IEEWAreaIntensity>
  hypocenter: IHypocenter
  is_cancel: boolean
  is_final: boolean
  is_plum: boolean
  is_test: boolean
  magnitude: string
  max_intensity: string
  p_wave: number
  s_wave: number
  report_flag: number
  report_id: number
  report_num: number
  report_time: string
  status: number
  type: string
}
