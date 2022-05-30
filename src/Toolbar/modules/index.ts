import { ARSANDTABLE, arSandTableData } from './arSandTable'
import { ARANIMATION, arAnimationData } from './arAnimation'
import { ARATTRIBUTE, arAttributeData } from './arAttribute'
import { ARMAP_STYLE, arMapStyleData } from './arMapStyle'

export type ModuleList = ARSANDTABLE
                       & ARANIMATION
                       & ARATTRIBUTE
                       & ARMAP_STYLE

export {
  arSandTableData,
  arAnimationData,
  arAttributeData,
  arMapStyleData
}