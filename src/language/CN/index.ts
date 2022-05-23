import { Navigator_Label } from './Navigator'
import { Map_Module } from './Map_module'
import { Profile } from './Profile'
import { Friends } from './Friends'
import { Find } from './Find'
import * as Analyst from './Analyst'
import * as Unit from './Unit'

import * as Map from './Map'
import { Prompt } from './Prompt'
import * as Common from './Common'
import * as Error from './Error'
import * as ARMap from './ARMap'
import * as Cowork from './Cowork'
import * as AI from './AI'

const ALL = {
  ...AI.AI,
  ...Analyst.Analyst_Labels,
  ...Analyst.Analyst_Methods,
  ...Analyst.Analyst_Modules,
  ...Analyst.Analyst_Params,
  ...Analyst.Analyst_Prompt,
  ...ARMap.ARMap,
  ...Common.Common,
  ...Common.Protocol,
  ...Cowork.Cowork,
  ...Error.RequestError,
  ...Find,
  ...Friends,
  ...Map_Module,
  ...Map.Map_Attribute,
  ...Map.Map_Label,
  ...Map.Map_Layer,
  ...Map.Map_Main_Menu,
  ...Map.Map_Plotting,
  ...Map.Map_PoiTitle,
  ...Map.Map_Setting,
  ...Map.Map_Settings,
  ...Map.Map_Tools,
  ...Map.Template,
  ...Navigator_Label,
  ...Profile,
  ...Prompt,
  ...Unit.FieldType,
}

export default {
  Navigator_Label,
  Map_Module,
  Profile,
  ...Map,
  Prompt,
  Friends,
  Find,
  ...Analyst,
  ...Unit,
  ...Common,
  ...Error,
  ...ARMap,
  ...Cowork,
  ...AI,
  ...ALL,
}
