import FloatBar, { FloatItem } from '@/components/FloatBar'
import NavigationService from '@/containers/NavigationService'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Animated,  Easing } from 'react-native'
import { ModuleViewProps } from '../..'
import { getImage } from '../../../assets'
import {  AppToolBar, dp } from '../../../utils'
import Attribute from './component/Attribute'

export interface ARAttributeViewOption {
  attribute: 'null' | 'attribute'
  showLayer: boolean
}

type Props = ModuleViewProps<ARAttributeViewOption>

class ARAttributeView extends React.Component<Props> {

  layerRight = new Animated.Value(-dp(80))

  constructor(props: Props) {
    super(props)
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

  isPortrait = true
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <>
        {this.renderLayer()}
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