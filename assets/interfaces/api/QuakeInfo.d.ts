import { IQuakeInfo } from '~/assets/interfaces/parsing/QuakeInfo'
import { IEEW } from '~/assets/interfaces/parsing/EEW'

export interface IInfo {
  eew?: IEEW;
  info: IQuakeInfo[];
}
