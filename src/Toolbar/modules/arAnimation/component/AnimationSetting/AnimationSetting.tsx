import React from 'react'
import { ARAnimatorCategory, ARAnimatorPlayOrder, ARAnimatorType, ARNodeAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARAnimatorParameter, ARModelAnimatorParameter, ARNodeAnimatorParameter, ModelAnimation } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { TARAnimatorCategory, TARAnimatorPlayOrder, TARAnimatorType, TARNodeAnimatorType, Vector3 } from 'imobile_for_reactnative/types/data'
import { ScaledSize, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { dp } from 'imobile_for_reactnative/utils/size'
import { AppStyle } from '../../../../../utils'
import { getLanguage } from '../../../../../language'
import { BoolItem, CounterItem, InputItem, ListItem, ListItemData, SelectItem, VectorItem } from '.'
import { getImage } from '../../../../../assets'

interface Props {
  onSave: (param: ARNodeAnimatorParameter | ARModelAnimatorParameter) => void
  onCancel: () => void
  editAnimator?: ARAnimatorParameter
  filters?: (1 | 2 | 3 | 4 | 5)[]
  animationType: 'setting' | 'aranimation'
  modelAnimationList: ModelAnimation[]
  windowSize: ScaledSize
}

interface State {
  paramList: ParamList
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

class AnimationSetting extends React.Component<Props, State> {

  paramList: ParamList

  isNew = false

  constructor(props: Props) {
    super(props)

    this.paramList = this.getDefaultParamList()

    this.state = {
      paramList: this.paramList
    }
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.editAnimator !== this.props.editAnimator) {
      this.update()
    }
  }

  update = () => {
    this.isNew = this.props.editAnimator === undefined
    const paramList = this.getDefaultParamList()
    if(this.props.editAnimator !== undefined) {
      const list = this._transformARParamToSettingParam(this.props.editAnimator)
      Object.assign(paramList, list)
    }
    this.paramList = paramList

    this.setState({
      paramList,
    })
  }

  goBack = () => {
    this.props.onCancel()
  }

  onCommit = () => {
    this.props.onSave(this._transformSettingParamToARParam(this.paramList))
  }

  getDefaultParamList = (): ParamList => {
    let category: TARAnimatorCategory = ARAnimatorCategory.CUSTOM
    let animationType: TARAnimatorType = ARAnimatorType.NODE_TYPE
    let nodeType: TARNodeAnimatorType = ARNodeAnimatorType.TRANSLATION
    let current: ParamList['currentPage'] = 'custom'
    if(this.props.filters !== undefined && this.props.filters.length > 0) {
      const first = this.props.filters.sort((a, b) => a - b)[0]
      if(first === 1) {
        animationType = ARAnimatorType.MODEL_TYPE
      } else if(first === 3) {
        nodeType = ARNodeAnimatorType.ROTATION
      } else if(first === 4) {
        nodeType = ARNodeAnimatorType.SCALE
      } else if(first === 5) {
        category = ARAnimatorCategory.APPEAR
        current = 'show&hide'
      }
    }
    return {
      name: 'New Animation',
      order: ARAnimatorPlayOrder.AFTER_PREVIOUS,
      repeatCount: 0,
      delay: 0,
      category: category, //ARAnimatorCategory.CUSTOM,
      type: animationType, // ARAnimatorType.NODE_TYPE,

      layerName: '',
      elementID: -1,

      modelAnimationIndex: 0,
      startFrame: 0,
      endFrame: -1,

      nodeType: nodeType, //ARNodeAnimatorType.TRANSLATION,
      duration: 2,

      moveFromCurrent: true, //需要转换
      startPosition: {x: 0, y: 0, z:0}, //需要转换
      endPosition: {x: 0, y: 0, z:0}, //需要转换

      rotationAxis: {x: 0, y: 1, z:0},
      fromDegree: 0, //需要转换
      degree: 90, //需要转换

      toScale: {x: 1, y: 1, z:1}, //需要转换

      currentPage: current //'custom'
    }
  }

  _transformSettingParamToARParam = (paramList: ParamList): ARNodeAnimatorParameter | ARModelAnimatorParameter => {
    const param = {...paramList} as ARNodeAnimatorParameter | ARModelAnimatorParameter
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

  _getAnimatorTypeListData = (): ListItemData[] => {
    let data: ListItemData[] = []
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

    const node_translation: ListItemData = {
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
    }

    const node_rotation: ListItemData = {
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
    }

    const node_scale: ListItemData = {
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
    }

    const appear: ListItemData = {
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

    if(this.props.filters && this.props.filters.length > 0) {
      if(this.props.filters.indexOf(1) > -1 && this.props.modelAnimationList.length > 0) {
        data.push(modelData)
      }
      if(this.props.filters.indexOf(2) > -1) {
        data.push(node_translation)
      }
      if(this.props.filters.indexOf(3) > -1) {
        data.push(node_rotation)
      }
      if(this.props.filters.indexOf(4) > -1) {
        data.push(node_scale)
      }
      if(this.props.filters.indexOf(5) > -1) {
        data.push(appear)
      }
    } else {
      if(this.props.modelAnimationList.length > 0) {
        data.push(modelData)
      }
      data = data.concat(node_translation, node_rotation, node_scale, appear)
    }

    return data
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
            this.setState({
              paramList: {...this.paramList},
            })
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

        {(this.props.animationType === 'aranimation'
          && this.state.paramList.currentPage === 'custom') && (
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

        {this.props.animationType === 'aranimation' && (
          <>

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
                this.setState({
                  paramList: {...this.paramList}
                })
              }}
            />

          </>
        )}

      </ScrollView>
    )
  }

  renderModelParam = () => {
    const data = this.props.modelAnimationList.map(item  => {
      return {
        label: item.name,
        value: item,
      }
    })
    let selectData = data[0] || undefined
    if(this.paramList.modelAnimationIndex < data.length) {
      selectData = data[this.paramList.modelAnimationIndex]
    }
    return (
      <>
        <Seperator text={getLanguage().BONE_ANIMATION}/>

        <SelectItem
          name={getLanguage().ANIMATION}
          mode={'list'}
          data={data}
          defalutValue={selectData && selectData.value}
          onValueChange={value => {
            this.paramList.modelAnimationIndex = value.id
            this.paramList.duration = value.duration
            this.setState({
              paramList: {...this.paramList}
            })
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
            this.setState({
              paramList: {...this.paramList},
            })
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
            this.setState({
              paramList: {...this.paramList},
            })
          }}
        />

      </>
    )
  }


  renderNodeTranslationParam = () => {
    return (
      <>
        <Seperator text={getLanguage().TRANSLATION}/>

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
            this.setState({
              paramList: {...this.paramList},
            })
          }}
        />}
        <InputItem
          name={getLanguage().END_DEGREE}
          value={this.state.paramList.degree}
          numberType={'float'}
          onValueChange={value => {
            this.paramList.degree = value
            this.setState({
              paramList: {...this.paramList},
            })
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
            this.setState({
              paramList: {...this.paramList}
            })
          }}
        />
      </>
    )
  }

  render() {
    return(
      <>
        {this.renderListHead()}
        {this.renderParams()}
      </>
    )
  }
}

export default AnimationSetting

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


