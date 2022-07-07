import { ARSANDTABLE, arSandTableData } from './arSandTable'
import { ARANIMATION, arAnimationData } from './arAnimation'
import { ARATTRIBUTE, arAttributeData } from './arAttribute'
import { ARMAP_STYLE, arMapStyleData } from './arMapStyle'
import { ARMAP_SETTING, arMapSettingData } from './arMapSetting'
import { ARMAP_ADD, arMapAddData } from './arMapAdd'

export type ModuleList = ARSANDTABLE
                       & ARANIMATION
                       & ARATTRIBUTE
                       & ARMAP_STYLE
                       & ARMAP_SETTING
                       & ARMAP_ADD

export {
  arSandTableData,
  arAnimationData,
  arAttributeData,
  arMapStyleData,
  arMapSettingData,
  arMapAddData,
}