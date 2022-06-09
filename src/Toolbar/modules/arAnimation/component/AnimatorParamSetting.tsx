import { ARAnimatorCategory, ARAnimatorPlayOrder, ARAnimatorType, ARNodeAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARAnimatorParameter, ARGroupAnimatorParameter } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { TARAnimatorCategory, TARAnimatorPlayOrder, TARAnimatorType, TARNodeAnimatorType, Vector3 } from 'imobile_for_reactnative/types/data'
import React from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { AppStyle, AppToolBar, dp } from '../../../../utils'
import { getImage } from '../../../../assets'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../../../redux/types'
import { ARAnimatorWithID, editARAnimation, setARAnimation } from '@/redux/models/aranimation'
import { getLanguage } from '../../../../language'
import { SARMap } from 'imobile_for_reactnative'
import { ToolbarSlideCard } from 'imobile_for_reactnative/components/ToolbarKit'
import {
  BoolItem,
  InputItem,
  SelectItem,
  ListItem,
  ListItemData,
  VectorItem,
  CounterItem,
} from './ParameterItems'
import * as ModuleData from '../Actions'


interface Props extends ReduxProps {
  visible: boolean
}

interface State {
  modelAnimationList: string[]
  paramList: ParamList
  listVisible: boolean
}

interface ParamList {
  name: string,
  /** 动画功能分类： 普通动画，出现/消失动画 */
  category: TARAnimatorCategory
  type: TARAnimatorType,
  order: TARAnimatorPlayOrder,
  repeatCount: number,
  delay: number,

  layerName: string,
  elementID: number,

  modelAnimationIndex: number,
  startFrame: number,
  endFrame: number,

  nodeType: TARNodeAnimatorType,
  duration: number,
  moveFromCurrent: boolean,
  startPosition: Vector3,
  endPosition: Vector3,

  rotationAxis: Vector3,
  fromDegree: number,
  degree: number,

  toScale: Vector3,

  currentPage: 'custom' | 'show&hide'
}

export interface ARAnimatorSettingParam {
  arModelAnimations: string[] | undefined
  editAnimator?: ARAnimatorWithID
  element: {layerName: string, id: number}
}


class AnimatorParamSetting extends React.Component<Props, State> {

  paramList

  isNew = false

  constructor(props: Props) {
    super(props)

    this.paramList = this.getDefaultParamList()

    this.state = {
      modelAnimationList: [],
      paramList: this.paramList,
      listVisible: this.props.visible,
    }

  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible) {
      if(this.props.visible) {
        this.onVisible()
      } else {
        this.setState({
          listVisible: false
        })
      }
    }
  }

  getDefaultParamList = (): ParamList => {
    return {
      name: 'New Animation',
      order: ARAnimatorPlayOrder.AFTER_PREVIOUS,
      repeatCount: 0,
      delay: 0,
      category: ARAnimatorCategory.CUSTOM,
      type: ARAnimatorType.NODE_TYPE,

      layerName: '',
      elementID: -1,

      modelAnimationIndex: 0,
      startFrame: 0,
      endFrame: -1,

      nodeType: ARNodeAnimatorType.TRANSLATION,
      duration: 2,

      moveFromCurrent: true, //需要转换
      startPosition: {x: 0, y: 0, z:0}, //需要转换
      endPosition: {x: 0, y: 0, z:0}, //需要转换

      rotationAxis: {x: 0, y: 1, z:0},
      fromDegree: 0, //需要转换
      degree: 90, //需要转换

      toScale: {x: 1, y: 1, z:1}, //需要转换

      currentPage: 'custom'
    }
  }

  onVisible = () => {
    const setting = ModuleData.getARAnimatorSettingParam()
    const editAnimator = setting.editAnimator
    const modelAnimation = setting.arModelAnimations

    this.isNew = editAnimator === undefined
    const paramList = this.getDefaultParamList()
    if(editAnimator === undefined) {
      paramList.layerName = setting.element.layerName
      paramList.elementID = setting.element.id
    } else {
      const list = this._transformARParamToSettingParam(editAnimator)
      Object.assign(paramList, list)
    }
    this.paramList = paramList

    this.setState({
      modelAnimationList: modelAnimation || [],
      paramList,
      listVisible: true,
    })
  }

  onCommit = () => {
    const setting = ModuleData.getARAnimatorSettingParam()
    const param = this._transformSettingParamToARParam(this.paramList)
    let animation: ARGroupAnimatorParameter<ARAnimatorParameter> | undefined = this.props.arAnimaton
    if(setting.editAnimator === undefined) {
      if(animation === undefined) {
        //直接新建动画，创建动画列表
        animation = {
          name: 'New Animation List',
          category: ARAnimatorCategory.CUSTOM,
          type: ARAnimatorType.GROUP_TYPE,
          delay: 0,
          order: ARAnimatorPlayOrder.AFTER_PREVIOUS,
          repeatCount: 0,
          animations: []
        }
        animation.animations.push(param)
        this.props.setARAnimation(animation)
      } else {
        //现有动画中添加
        animation.animations.push(param)
        this.props.setARAnimation({...animation})
      }
    } else {
      const editId = setting.editAnimator.eid
      this.props.editARAnimation(editId, param)
    }

    SARMap.clearSelection()
    AppToolBar.goBack()
  }

  goBack = () => {
    AppToolBar.goBack()
  }

  _transformSettingParamToARParam = (paramList: ParamList): ARAnimatorParameter => {
    const param = {...paramList} as ARAnimatorParameter
    //某些UI设置参数转换到推演动画参数
    if(param.type === ARAnimatorType.NODE_TYPE) {
      if(param.nodeType === ARNodeAnimatorType.TRANSLATION) {
        const translations:Vector3[] = []
        if(!paramList.moveFromCurrent) {
          translations.push(paramList.startPosition)
        }
        translations.push(paramList.endPosition)
        param.translations = translations
      } else if(param.nodeType === ARNodeAnimatorType.ROTATION){
        const degrees: number[] = []
        if(!paramList.moveFromCurrent) {
          degrees.push(paramList.fromDegree)
        }
        degrees.push(paramList.degree)
        param.degrees = degrees
      } else {
        param.scales = [paramList.toScale]
        if(paramList.currentPage === 'show&hide' && paramList.category === ARAnimatorCategory.DISAPPEAR) {
          param.scales = [{x: 0, y: 0, z: 0}]
        } else if(paramList.currentPage === 'show&hide' && paramList.category === ARAnimatorCategory.APPEAR){
          param.scales = [{x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}]
        }
      }
    }
    return param
  }

  _transformARParamToSettingParam = (param: ARAnimatorParameter): ParamList => {
    const paramList = this.getDefaultParamList()
    Object.assign(paramList, param)
    if(param.type === ARAnimatorType.NODE_TYPE) {
      if(param.nodeType === ARNodeAnimatorType.TRANSLATION) {
        if(param.translations.length === 1) {
          paramList.moveFromCurrent = true
          paramList.endPosition = param.translations[0]
        } else {
          paramList.moveFromCurrent = false
          paramList.startPosition = param.translations[0]
          paramList.endPosition = param.translations[param.translations.length-1]
        }
      } else if(param.nodeType === ARNodeAnimatorType.ROTATION){
        if(param.degrees.length === 1) {
          paramList.moveFromCurrent = true
          paramList.degree = param.degrees[0]
        } else {
          paramList.moveFromCurrent = false
          paramList.fromDegree = param.degrees[0]
          paramList.degree = param.degrees[param.degrees.length-1]
        }
      } else {
        paramList.toScale = param.scales[0]
      }
    }

    if(param.category === ARAnimatorCategory.APPEAR
      || param.category === ARAnimatorCategory.DISAPPEAR
    ) {
      paramList.currentPage = 'show&hide'
    }

    return paramList
  }

  renderHeadButton = (btn: {text: string, action: () => void}): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={btn.action}
      >
        <Text style={AppStyle.h2g}>
          {btn.text}
        </Text>
      </TouchableOpacity>
    )
  }

  renderListHead = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dp(30),
          alignItems: 'center',
          height: dp(50),
          width: '100%',
          borderTopLeftRadius: dp(20),
          borderTopRightRadius: dp(20),
        }}
      >
        {this.renderHeadButton({text: getLanguage().CANCEL, action: this.goBack})}
        {this.renderHeadButton({text: getLanguage().SAVE, action: this.onCommit})}
      </View>
    )
  }

  _getAnimatorTypeListData = (): ListItemData[] => {
    const data: ListItemData[] = []
    const modelData: ListItemData = {
      image: getImage().ar_3d_model,
      text: getLanguage().BONE_ANIMATION,
      key: '1',
      onPress: () => {
        this.paramList.type = ARAnimatorType.MODEL_TYPE
        this.paramList.category = ARAnimatorCategory.CUSTOM
        this.paramList.currentPage = 'custom'
        this.setState({paramList: { ...this.paramList}})
      },
      disable: !this.isNew,
    }

    const nodeData :ListItemData[] = [
      {
        image: getImage().ar_translation,
        text: getLanguage().TRANSLATION,
        key: '2',
        onPress: () => {
          this.paramList.type = ARAnimatorType.NODE_TYPE
          this.paramList.nodeType = ARNodeAnimatorType.TRANSLATION
          this.paramList.category = ARAnimatorCategory.CUSTOM
          this.paramList.currentPage = 'custom'
          this.setState({paramList: { ...this.paramList}})
        },
        disable: !this.isNew
      },
      {
        image: getImage().ar_rotate,
        text: getLanguage().ROTATION,
        key: '3',
        onPress: () => {
          this.paramList.type = ARAnimatorType.NODE_TYPE
          this.paramList.nodeType = ARNodeAnimatorType.ROTATION
          this.paramList.category = ARAnimatorCategory.CUSTOM
          this.paramList.currentPage = 'custom'
          this.setState({paramList: { ...this.paramList}})
        },
        disable: !this.isNew
      },
      {
        image: getImage().ar_scale,
        text: getLanguage().SCALE,
        key: '4',
        onPress: () => {
          this.paramList.type = ARAnimatorType.NODE_TYPE
          this.paramList.nodeType = ARNodeAnimatorType.SCALE
          this.paramList.category = ARAnimatorCategory.CUSTOM
          this.paramList.currentPage = 'custom'
          this.setState({paramList: { ...this.paramList}})
        },
        disable: !this.isNew
      },
      {
        image: getImage().icon_visible,
        text: getLanguage().VISIBILITY,
        key: '5',
        onPress: () => {
          this.paramList.type = ARAnimatorType.NODE_TYPE
          this.paramList.nodeType = ARNodeAnimatorType.SCALE
          this.paramList.category = ARAnimatorCategory.APPEAR
          this.paramList.currentPage = 'show&hide'
          this.setState({paramList: { ...this.paramList}})
        },
        disable: !this.isNew
      }
    ]

    if(this.state.modelAnimationList.length > 0) {
      data.push(modelData)
    }

    return data.concat(nodeData)
  }

  renderNodeList = () => {
    let selectKey = ''
    if(this.state.paramList.type === ARAnimatorType.MODEL_TYPE) {
      selectKey = '1'
    } else if(this.state.paramList.nodeType === ARNodeAnimatorType.TRANSLATION) {
      selectKey = '2'
    } else if(this.state.paramList.nodeType === ARNodeAnimatorType.ROTATION) {
      selectKey = '3'
    } else if(this.state.paramList.nodeType === ARNodeAnimatorType.SCALE) {
      selectKey = '4'
    }
    if(this.state.paramList.currentPage === 'show&hide') {
      selectKey = '5'
    }
    return (
      <ListItem
        data={this._getAnimatorTypeListData()}
        selectKey={selectKey}
        windowSize={this.props.windowSize}
      />
    )
  }

  renderParams = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          paddingBottom: 2,
        }}
      >
        {this.state.paramList.type !== ARAnimatorType.GROUP_TYPE
          && this.renderNodeList()}

        <Seperator text={getLanguage().NAME}/>

        <InputItem
          name={getLanguage().NAME}
          value={this.state.paramList.name}
          onValueChange={value => {
            this.paramList.name = value
          }}
        />


        {this.state.paramList.type === ARAnimatorType.MODEL_TYPE &&
          this.renderModelParam()
        }

        {this.state.paramList.type === ARAnimatorType.NODE_TYPE &&
          this.state.paramList.nodeType === ARNodeAnimatorType.TRANSLATION &&
          this.renderNodeTranslationParam()
        }

        {this.state.paramList.type === ARAnimatorType.NODE_TYPE &&
          this.state.paramList.nodeType === ARNodeAnimatorType.ROTATION &&
          this.renderNodeRotationParam()
        }

        {this.state.paramList.type === ARAnimatorType.NODE_TYPE &&
          this.state.paramList.nodeType === ARNodeAnimatorType.SCALE &&
          (this.state.paramList.currentPage === 'custom')&&
          this.renderNodeScaleParam()
        }

        {this.state.paramList.type === ARAnimatorType.NODE_TYPE &&
          this.state.paramList.nodeType === ARNodeAnimatorType.SCALE &&
          (this.state.paramList.currentPage === 'show&hide') &&
          this.renderAppearParam()
        }

        <Seperator text={getLanguage().TIME}/>

        {this.state.paramList.type !== ARAnimatorType.GROUP_TYPE && (
          <>
            <CounterItem
              name={
                getLanguage().DURATION + '/' +
                getLanguage().SECOND
              }
              value={this.state.paramList.duration}
              numberType={'float'}
              onValueChange={value => {
                this.paramList.duration = value
              }}
            />

          </>
        )}

        <CounterItem
          name={
            getLanguage().DELAY + '/' +
            getLanguage().SECOND
          }
          numberType={'float'}
          value={this.state.paramList.delay}
          onValueChange={value => {
            this.paramList.delay = value
          }}
        />

        {this.state.paramList.currentPage === 'custom' && (
          <>
            <BoolItem
              name={getLanguage().KEEP_REPEATE}
              value={this.state.paramList.repeatCount === -1}
              onValueChange={value => {
                this.paramList.repeatCount = value ? -1 : 0
                this.setState({
                  paramList: {
                    ...this.state.paramList,
                    repeatCount: value ? -1 : 0
                  }
                })
              }}
            />

            {this.state.paramList.repeatCount !== -1 &&
               <CounterItem
                 name={getLanguage().REPEAT_COUNT}
                 numberType={'int'}
                 value={this.state.paramList.repeatCount}
                 onValueChange={value => {
                   this.paramList.repeatCount = value
                 }}
               />
            }
          </>
        )}

        <Seperator text={getLanguage().START}/>

        <SelectItem
          name={getLanguage().ORDER}
          mode={'flat'}
          data={[
            {label: getLanguage().TOUCH_TO_START, value: ARAnimatorPlayOrder.ON_TOUCH},
            {label: getLanguage().WITH_PREV_ANIMATION, value: ARAnimatorPlayOrder.WITH_PREVIOUS},
            {label: getLanguage().AFTER_PREV_ANIMATION, value: ARAnimatorPlayOrder.AFTER_PREVIOUS},
          ]}
          defalutValue={this.state.paramList.order}
          onValueChange={value => {
            this.paramList.order = value as TARAnimatorPlayOrder
          }}
        />

      </ScrollView>
    )
  }


  renderModelParam = () => {
    const data = this.state.modelAnimationList.map((item, index) => {
      return {
        label: item,
        value: index,
      }
    })
    return (
      <>
        <Seperator text={getLanguage().BONE_ANIMATION}/>

        <SelectItem
          name={getLanguage().ANIMATION}
          mode={'list'}
          data={data}
          defalutValue={this.state.paramList.modelAnimationIndex}
          onValueChange={value => {
            this.paramList.modelAnimationIndex = value as number
          }}
        />
        <InputItem
          name={
            getLanguage().START_FRAME + '(' +
            getLanguage().SECOND + ')'
          }
          value={this.state.paramList.startFrame}
          numberType={'float'}
          onValueChange={value => {
            this.paramList.startFrame = value
          }}
        />

        <InputItem
          name={
            getLanguage().END_FRAME + '(' +
            getLanguage().SECOND + ')'
          }
          value={this.state.paramList.endFrame}
          numberType={'float'}
          onValueChange={value => {
            this.paramList.endFrame = value
          }}
        />

      </>
    )
  }

  renderNodeTranslationParam = () => {
    return (
      <>
        <Seperator text={getLanguage().ARMap.TRANSLATION}/>

        <BoolItem
          name={getLanguage().START_FROM_CURRENT_POSITION}
          value={this.state.paramList.moveFromCurrent}
          onValueChange={value => {
            this.paramList.moveFromCurrent = value
            this.setState({
              paramList: {
                ...this.state.paramList,
                moveFromCurrent: value
              }})
          }}
        />
        {!this.state.paramList.moveFromCurrent && <VectorItem
          name={getLanguage().START_POSITION}
          value={this.state.paramList.startPosition}
          onValueChange={value => {
            this.paramList.startPosition = value
          }}
        />}
        <VectorItem
          name={getLanguage().END_POSITION}
          value={this.state.paramList.endPosition}
          onValueChange={value => {
            this.paramList.endPosition = value
          }}
        />
      </>
    )
  }

  _renderRotateAxis = () => {
    const currentAxis = this.state.paramList.rotationAxis
    let selectKey = 'x'
    if(currentAxis.y > 0) {
      selectKey = 'y'
    } else if(currentAxis.z > 0) {
      selectKey = 'z'
    }
    return (
      <ListItem
        data={[{
          image: getImage().rotation_x,
          text: 'x',
          key: 'x',
          onPress: () => {
            this.paramList.rotationAxis = {x: 1, y: 0, z: 0}
          },
          disable: false,
        }, {
          image: getImage().rotation_y,
          text: 'y',
          key: 'y',
          onPress: () => {
            this.paramList.rotationAxis = {x: 0, y: 1, z: 0}
          },
          disable: false,
        }, {
          image: getImage().rotation_z,
          text: 'z',
          key: 'z',
          onPress: () => {
            this.paramList.rotationAxis = {x: 0, y: 0, z: 1}
          },
          disable: false,
        }
        ]}
        selectKey={selectKey}
        windowSize={this.props.windowSize}
      />
    )
  }

  renderNodeRotationParam = () => {
    return (
      <>
        <Seperator text={getLanguage().ROTATION_AXIS}/>

        {this._renderRotateAxis()}

        <BoolItem
          name={getLanguage().START_FROM_CURRENT_DGREE}
          value={this.state.paramList.moveFromCurrent}
          onValueChange={value => {
            this.paramList.moveFromCurrent = value
            this.setState({
              paramList: {
                ...this.state.paramList,
                moveFromCurrent: value
              }})
          }}
        />
        {!this.state.paramList.moveFromCurrent && <InputItem
          name={getLanguage().START_DEGREE}
          value={this.state.paramList.fromDegree}
          numberType={'float'}
          onValueChange={value => {
            this.paramList.fromDegree = value
          }}
        />}
        <InputItem
          name={getLanguage().END_DEGREE}
          value={this.state.paramList.degree}
          numberType={'float'}
          onValueChange={value => {
            this.paramList.degree = value
          }}
        />
      </>
    )
  }

  renderNodeScaleParam = () => {
    return (
      <>
        <Seperator text={getLanguage().SCALE}/>
        <VectorItem
          // name={getLanguage().SCALE}
          value={this.state.paramList.toScale}
          onValueChange={value => {
            this.paramList.toScale = value
          }}
        />
      </>
    )
  }


  renderAppearParam = () => {
    let defaultValue = 'show'
    if(this.state.paramList.category ===ARAnimatorCategory.DISAPPEAR) {
      defaultValue = 'hide'
    }
    return (
      <>
        <Seperator text={getLanguage().CATEGORY}/>
        <SelectItem
          name={getLanguage().CATEGORY}
          mode={'flat'}
          data={[{
            label: getLanguage().SHOW,
            value: 'show',
          }, {
            label: getLanguage().HIDE,
            value: 'hide',
          }
          ]}
          defalutValue={defaultValue}
          onValueChange={value => {
            if(value === 'show') {
              this.paramList.category = ARAnimatorCategory.APPEAR
            } else if(value === 'hide') {
              this.paramList.category = ARAnimatorCategory.DISAPPEAR
            }
          }}
        />
      </>
    )
  }

  render() {
    return(
      <ToolbarSlideCard
        visible={this.state.listVisible}
      >
        {this.renderListHead()}
        {this.renderParams()}
      </ToolbarSlideCard>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  arAnimaton: state.aranimation.arAnimation,
  windowSize: state.device.toJS().windowSize
})

const mapDispatch = {
  setARAnimation,
  editARAnimation
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(AnimatorParamSetting)


const Seperator = (props: {text?: string}): JSX.Element => {
  return (
    <View style={{
      width: '100%',
      paddingHorizontal: dp(30),
      justifyContent: 'center',
      marginVertical: dp(10),
    }}>
      <Text style={AppStyle.h2}>
        {props.text}
      </Text>
    </View>
  )
}


