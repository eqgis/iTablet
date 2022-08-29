import { SARMap } from 'imobile_for_reactnative'
import { ToolbarSlideCard } from 'imobile_for_reactnative/components/ToolbarKit'
import { ARModelAnimatorParameter, ARNodeAnimatorParameter, ModelAnimation } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import React from 'react'
import { ScaledSize } from 'react-native'
import { AppLog, AppToolBar } from '../../../../utils'
import AnimationSetting from '../../arAnimation/component/AnimationSetting/AnimationSetting'

interface Props {
  type: 'node' | 'model' | 'null'
  windowSize: ScaledSize
}

interface State {
  modelAnimationList: ModelAnimation[]
  listVisible: boolean
}

class AddElementAnimation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      modelAnimationList: [],
      listVisible: false,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.type !== this.props.type) {
      if(this.props.type !== 'null') {
        this.onVisible()
      } else {
        this.setState({listVisible: false})
      }
    }
  }

  onVisible = async () => {
    const editElement = AppToolBar.getData().selectARElement
    if(editElement) {
      let modelAnimations: ModelAnimation[] = []
      if(this.props.type === 'model') {
        modelAnimations = await SARMap.getModelAnimation(editElement.layerName, editElement.id)
      }
      this.setState({
        modelAnimationList: modelAnimations,
        listVisible: true,
      })
    } else {
      AppLog.error('未选中对象')
    }
  }

  save = async (params: ARModelAnimatorParameter | ARNodeAnimatorParameter) => {
    const editElement = AppToolBar.getData().selectARElement
    if(!editElement) {
      AppLog.error('未选中对象')
      return
    }
    if(this.props.type === 'model') {
      params.layerName = editElement.layerName
      params.elementID = editElement.id
    }
    const id = await SARMap.addAnimation(params)
    SARMap.setAnimation(editElement.layerName, editElement.id, id)
    AppToolBar.goBack()
  }

  render() {
    return(
      <ToolbarSlideCard
        visible={this.state.listVisible}
      >
        <AnimationSetting
          onSave={this.save}
          onCancel={AppToolBar.goBack}
          animationType={'setting'}
          modelAnimationList={this.state.modelAnimationList}
          windowSize={this.props.windowSize}
          filters={this.props.type === 'model' ? [1] : [2, 3]}
        />
      </ToolbarSlideCard>
    )
  }
}

export default AddElementAnimation