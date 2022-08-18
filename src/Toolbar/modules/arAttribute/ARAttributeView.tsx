import FloatBar, { FloatItem } from '@/components/FloatBar'
import NavigationService from '@/containers/NavigationService'
import { SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Animated,  Easing } from 'react-native'
import { ModuleViewProps } from '../..'
import { getImage } from '../../../assets'
import { AppToolBar, dp } from '../../../utils'
import Attribute from './component/Attribute'
import PipeLineAttribute from './component/pipeLineAttribute'
import { PipeLineAttributeType } from './component/pipeLineAttribute/PipeLineAttribute'

export interface ARAttributeViewOption {
  attribute: 'null' | 'attribute'
  showLayer: boolean
}

type Props = ModuleViewProps<ARAttributeViewOption>

class ARAttributeView extends React.Component<Props> {

  layerRight = new Animated.Value(-dp(80))

  constructor(props: Props) {
    super(props)
    this.props.setPipeLineAttribute([])
  }
  componentDidMount = async () => {
    if(Platform.OS === 'ios'){
      return
    }
    SARMap.setSceneAction("PANSELECT3D")
    await SARMap.addAttributeListener({
      callback: async (result: any) => {
        // console.warn("result01: " + JSON.stringify(result))
        const arr: Array<PipeLineAttributeType> = []
        Object.keys(result).forEach(key => {
          const item: PipeLineAttributeType = {
            title: key,
            value: result[key],
          }

          if (key === 'id') {
            arr.unshift(item)
          } else {
            arr.push(item)
          }
        })
        // 将数据放入redux里
        AppToolBar.getProps().setPipeLineAttribute(arr)
        if(arr.length > 0) {
          const preElement = AppToolBar.getData().selectARElement
          if(preElement && Platform.OS === 'android') {
            await SARMap.hideAttribute(preElement.layerName, preElement.id)
          }
          AppToolBar.addData({
            selectedAttribute: undefined,
            selectARElement: undefined,
          })
          SARMap.clearSelection()
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


export default ARAttributeView

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