import { ConstToolType} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import ToolAction from '../toolModule/ToolAction'

class CameraModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  action = async () => {
    console.warn("344542322")
    ToolAction.captureImage()
  }
}

export default function() {
  return new CameraModule({
    type: "CAMERA",
    title: "相机",
    size: 'large',
    image: getThemeAssets().mapTools.icon_tool_multi_media,
  })
}
