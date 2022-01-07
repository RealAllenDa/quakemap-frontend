/* eslint-disable camelcase */
import { _IIntensities, _ITsunamiComments } from '~/assets/interfaces'

export interface IHypocenter {
  depth: string
  latitude: number
  longitude: number
  name: string
}

export interface IQuakeInfo {
  area_intensity: _IIntensities
  hypocenter: IHypocenter // TODO: To private
  magnitude: string
  max_intensity: string
  occur_time: string
  receive_time: string
  tsunami_comments: _ITsunamiComments
  type: string
}
