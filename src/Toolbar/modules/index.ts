import { ARSANDTABLE, arSandTableData } from './arSandTable'
import { ARANIMATION, arAnimationData } from './arAnimation'
import { ARATTRIBUTE, arAttributeData } from './arAttribute'

export type ModuleList = ARSANDTABLE
                       & ARANIMATION
                       & ARATTRIBUTE

export {
  arSandTableData,
  arAnimationData,
  arAttributeData,
}