import React from 'react'
import { ScaledSize, View } from 'react-native'
import Slider, {Props as SliderItem } from '../../../components/Slider'
import ToolBarList, { ToolBarListOption } from '../ToolBarList'
import { Button } from '@/components'
import { dp } from '../../../utils'
import { ToolBarSlideItem } from '../ToolBarSlide'
import ToolbarColor, { ToolbarColorOption } from '../ToolbarColor'


export type ToolbarTabItem = TabSlide | TabList | TabColor

interface CommonProps {
  title: string
  onPress?: (index: number) => void
}

interface TabSlide extends CommonProps {
  type: 'slide'
  slideData: SliderItem[]
  /** 页面添加应用功能 */
  apply?: () => void
}

interface TabList extends CommonProps, ToolBarListOption {
  type: 'list'
}

interface TabColor extends CommonProps {
  type: 'color'
  data: ToolbarColorOption
}

interface Props {
  data: ToolbarTabItem
  visible: boolean
  windowSize: ScaledSize
}

interface State {
  inited: boolean
}

class ToolbarTabView extends React.Component<Props, State> {

  resetableViewRefs: (Slider | ToolBarList)[] = []

  constructor(props: Props) {
    super(props)

    this.state = {
      inited: this.props.visible,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible) {
      this.onVisibleChange()
    }
    if(prevProps.data !== this.props.data) {
      this.onDataChange()
    }
  }

  onDataChange = () => {
    this.setState({
      inited: this.props.visible
    })
  }

  onVisibleChange = () => {
    if(this.props.visible && !this.state.inited) {
      this.setState({inited: true})
    }
  }

  reset = () => {
    this.resetableViewRefs.forEach(item => {
      item.reset()
    })
  }

  apply = (fn: () => void) => {
    this.reset()
    fn()
  }

  renderColor = (data: ToolbarColorOption) => {
    return (
      <View>
        <ToolbarColor
          toolbarVisible={true}
          animation={false}
          data={data}
          windowSize={this.props.windowSize}
        />
      </View>
    )
  }

  renderList = (option: ToolBarListOption) => {
    return (
      <View>
        <ToolBarList
          ref={ref => ref && this.resetableViewRefs.push(ref)}
          visible={true}
          oneColumn={true}
          animation={false}
          {...option}
          showSelect={option.showSelect !== undefined ? option.showSelect : true}
          windowSize={this.props.windowSize}
        />
      </View>

    )
  }

  renderSlide = (data: ToolBarSlideItem[], apply?: () => void) => {
    return (
      <View
        style={!this.isPortrait && {flex: 1}}
      >
        <View
          style={!this.isPortrait && {flex: 1, flexDirection: 'row', justifyContent: 'center'}}
        >
          {data.map((item: ToolBarSlideItem, index: number) => {
            return (
              <Slider
                key={index}
                ref={ref => ref && this.resetableViewRefs.push(ref)}
                showManulController={true}
                right={{type: 'indicator'}}
                horizontal={this.isPortrait}
                {...item}
              />
            )
          })}
        </View>
        {apply && (
          <Button
            onPress={() => this.apply(apply)}
            title={'应用'}
            style={{alignSelf: 'flex-end', height: dp(30), marginRight: dp(10)}}
          />
        )}
      </View>
    )
  }

  renderView = () => {
    this.resetableViewRefs = []
    switch(this.props.data.type) {
      case 'color':
        return this.renderColor(this.props.data.data)
      case 'list':
        return this.renderList(this.props.data)
      case 'slide':
        return this.renderSlide(this.props.data.slideData, this.props.data.apply)
      default:
        return null
    }
  }

  isPortrait = true

  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <View
        style={[
          this.isPortrait ? {
            width: this.props.windowSize.width,
          } : {
            height: this.props.windowSize.height,
          },
          !this.props.visible && (this.isPortrait ? {height: 0, opacity: 0}: {width: 0, opacity: 0}),
        ]}
      >
        {this.state.inited && this.renderView()}
      </View>
    )
  }
}

export default ToolbarTabView