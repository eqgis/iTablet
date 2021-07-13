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
}
