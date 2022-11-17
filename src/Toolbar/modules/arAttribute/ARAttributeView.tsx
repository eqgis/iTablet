import FloatBar, { FloatItem } from '@/components/FloatBar'
import NavigationService from '@/containers/NavigationService'
import { RootState } from '@/redux/types'
import { ARAction, SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { Animated,  Easing } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { ModuleViewProps } from '../..'
import { getImage } from '../../../assets'
import { AppToolBar, dp } from '../../../utils'
import Attribute from './component/Attribute'
import { AttributeDetail } from './component/LayerAttribute'
import PipeLineAttribute from './component/pipeLineAttribute'
import { PipeLineAttributeType } from './component/pipeLineAttribute/PipeLineAttribute'

export interface ARAttributeViewOption {
  attribute: 'null' | 'attribute'
  showLayer: boolean
}

type Props = ModuleViewProps<ARAttributeViewOption> & ReduxProps

class ARAttributeView extends React.Component<Props> {

  layerRight = new Animated.Value(-dp(80))
  detailPopModal: AttributeDetail | null | undefined

  constructor(props: Props) {
    super(props)
    this.props.setPipeLineAttribute([])
  }
  componentDidMount = async () => {
    if(Platform.OS === 'ios'){
      return
    }
    await SARMap.addAttributeListener({
      callback: async (result: any) => {
        try {
          if(AppToolBar.getCurrentOption()?.key === 'AR_MAP_BROWSE_ELEMENT'){
            return
          }
          // console.warn("result01: " + JSON.stringify(result))
          const arr: Array<PipeLineAttributeType> = []
          let srcId = ''
          Object.keys(result).forEach(key => {
            const item: PipeLineAttributeType = {
              title: key,
              value: result[key],
            }


            if (key === 'id') {
              arr.unshift(item)
            } else if(key !== 'action' && item.value !== "") {
              // 不以sm开头， 或是以下四种情况之一
              if(key.substring(0,2)!== 'Sm' || key === 'SmID'
              || key === 'SmLength' || key === 'SmTNode'
              || key === 'SmEdgeID' || key === 'SmGeoPosition') {
                arr.push(item)
              }
            }
            // 记录点击管线的唯一id
            if(key === 'SmID'){
              srcId =  result[key]
            }
          })
          // 将数据放入redux里

          const prePipeLineAttribute = AppToolBar.getProps().pipeLineAttribute
          let preSrcId: string | undefined = undefined
          if(prePipeLineAttribute && prePipeLineAttribute.length > 0){
            const value = prePipeLineAttribute?.find((element) => {
              if(element.title === 'SmID') {
                return element
              }
            })
            preSrcId = value && value.value
          }

          if(arr.length > 0) {
            // 若此次点击与上一次点击的是同一个管，就是隐藏，即将数据置为空数组
            if(preSrcId && preSrcId === srcId) {
              AppToolBar.getProps().setPipeLineAttribute([])
            } else {
              AppToolBar.getProps().setPipeLineAttribute(arr)
            }
          }

        } catch (error) {
          console.error("三维管线监听回调函数出错")
        }
      }
    })
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data?.showLayer !== this.props.data?.showLayer) {
      this.chnageLayerPostion()
    }
  }

  chnageLayerPostion = () => {
    const visible = !!this.props.data?.showLayer
    Animated.timing(this.layerRight, {
      toValue: visible ? dp(25) : -dp(80),
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false
    }).start()
  }

  getLayerData = (): FloatItem[] => {
    const data: FloatItem[] = [{
      image: getImage().icon_layer, // todo image
      key: 'layer',
      action: () => {
        NavigationService.navigate("ARLayerManager")
      }
    }]

    return data
  }

  renderLayer = () => {
    return (
      <Animated.View style={
        this.isPortrait ? {
          right: this.layerRight,
          ...styles.settingButton
        } : {
          top: dp(30),
          left: this.layerRight,
          ...styles.settingButtonL
        }}>
        <FloatBar
          data={this.getLayerData()}
          showSeperator={false}
        />
      </Animated.View>
    )
  }

  renderPipeLineAttribute = () => {
    return (
      <PipeLineAttribute/>
    )
  }

  isPortrait = true
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <>
        {/* {this.renderLayer()} */}
        {this.renderPipeLineAttribute()}
        {this.props.data?.attribute === 'attribute' && <Attribute  />}
      </>
    )
  }
}


// export default ARAttributeView

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device
})

const mapDispatch = {

}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ARAttributeView)


const styles = StyleSheet.create({
  settingButton: {
    position: 'absolute',
    top: dp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButtonL: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})