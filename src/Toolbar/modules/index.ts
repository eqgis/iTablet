import { ARSANDTABLE, arSandTableData } from './arSandTable'
import { ARANIMATION, arAnimationData } from './arAnimation'
import { ARATTRIBUTE, arAttributeData } from './arAttribute'
import { ARMAP_STYLE, arMapStyleData } from './arMapStyle'
import { ARMAP_SETTING, arMapSettingData } from './arMapSetting'

export type ModuleList = ARSANDTABLE
                       & ARANIMATION
                       & ARATTRIBUTE
                       & ARMAP_STYLE
                       & ARMAP_SETTING

export {
  arSandTableData,
  arAnimationData,
  arAttributeData,
  arMapStyleData,
  arMapSettingData,
}