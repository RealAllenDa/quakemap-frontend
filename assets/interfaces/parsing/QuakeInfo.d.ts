/* eslint-disable camelcase */
import { IIntensities } from '~/assets/interfaces/parsing/Intensities'

export interface IHypocenter {
  depth: string
  latitude: number
  longitude: number
  name: string
}

interface ITsunamiComments {
  domestic: string;
  global: string;
}

export interface IQuakeInfo {
  area_intensity: IIntensities
  hypocenter: IHypocenter // TODO: To private
  magnitude: string
  max_intensity: string
  occur_time: string
  receive_time: string
  tsunami_comments: ITsunamiComments
  type: string
}
