import { ARSANDTABLE, arSandTableData } from './arSandTable'
import { ARANIMATION, arAnimationData } from './arAnimation'
import { ARATTRIBUTE, arAttributeData } from './arAttribute'
import { ARMAP_STYLE, arMapStyleData } from './arMapStyle'
import { ARMAP_SETTING, arMapSettingData } from './arMapSetting'
import { ARMAP_ADD, arMapAddData } from './arMapAdd'
import { ARMAP_TOOLBOX, arMapToolbox} from './arToolbox'

export type ModuleList = ARSANDTABLE
                       & ARANIMATION
                       & ARATTRIBUTE
                       & ARMAP_STYLE
                       & ARMAP_SETTING
                       & ARMAP_ADD
                       & ARMAP_TOOLBOX

export {
  arSandTableData,
  arAnimationData,
  arAttributeData,
  arMapStyleData,
  arMapSettingData,
  arMapAddData,
  arMapToolbox,
}