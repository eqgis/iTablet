import { ARSANDTABLE, arSandTableData } from './arSandTable'
import { ARANIMATION, arAnimationData } from './arAnimation'
import { ARATTRIBUTE, arAttributeData } from './arAttribute'
import { ARMAP_STYLE, arMapStyleData } from './arMapStyle'
import { ARMAP_SETTING, arMapSettingData } from './arMapSetting'
import { ARMAP_ADD, arMapAddData } from './arMapAdd'
import { ARMAP_TOOLBOX, arMapToolbox} from './arToolbox'
import { ARMAP, arMapData} from './arMap'
import { ARMAP_EDIT, arMapEditData } from './arMapEdit'

export type ModuleList = ARSANDTABLE
                       & ARANIMATION
                       & ARATTRIBUTE
                       & ARMAP_STYLE
                       & ARMAP_SETTING
                       & ARMAP_ADD
                       & ARMAP_TOOLBOX
                       & ARMAP
                       & ARMAP_EDIT

export {
  arSandTableData,
  arAnimationData,
  arAttributeData,
  arMapStyleData,
  arMapSettingData,
  arMapAddData,
  arMapToolbox,
  arMapData,
  arMapEditData,
}