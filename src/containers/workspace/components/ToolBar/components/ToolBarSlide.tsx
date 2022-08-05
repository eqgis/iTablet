import React from 'react'
import { Text, View, Dimensions, StyleSheet, TextInput } from 'react-native'
import { color } from '../../../../../styles'
import { ToolBarSlideItem } from 'imobile_for_reactnative/components/ToolbarKit/component/ToolBarSlide'
import { Slider } from 'imobile_for_reactnative/components'
import { getImage } from '@/assets'
import { AppStyle, dp, Toast } from '@/utils'
import { getLanguage } from '@/language'

export interface ToolBarSlideOption {
  title?: string,
  data: ToolBarSlideItem[],
  showRatio?: boolean
  /** 页面添加应用功能 */
  apply?: () => void
}

interface Props {
  data: ToolBarSlideOption,
}

interface State {
  slideRatio: number
}

class ToolBarSlide extends React.Component<Props, State> {
  dimensions = Dimensions.get('screen')
  sliderBars = new Map<number, Slider>()

  static defaultProps = {
    data: [],
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      slideRatio: 1,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
      || JSON.stringify(nextState) !== JSON.stringify(this.state)
    )
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data.data !== this.props.data.data) {
      this.onDataChange()
    }
  }

  onDataChange = () => {
    this.setState({
      slideRatio: 1,
    })
  }

  componentWillUnmount() {
    if (this.sliderBars && this.sliderBars.size > 0) {
      this.sliderBars.clear()
    }
  }

  reset = () => {
    if (this.sliderBars?.size) {
      this.sliderBars.forEach(itemRef => {
        itemRef?.reset()
      })
    }
  }

  renderItem = (item: ToolBarSlideItem, index: number) => {
    return (
      <Slider
        ref={ref => ref && this.sliderBars?.set(index, ref)}
        key={index}
        showManulController={true}
        right={{type: 'indicator'}}
        horizontal={true}
        {...item}
        onMove={(value, isMin) => {
          item.onMove(value * this.state.slideRatio, isMin)
        }}
        incrementImage={getImage().icon_enlarge}
        decrementImage={getImage().icon_narrow}
        checkImage={getImage().icon_check}
        uncheckImage={getImage().icon_uncheck}
      />
    )
  }

  renderItems = (): JSX.Element[] | null => {
    const items = []
    if(this.props.data && this.props.data.data && this.props.data.data instanceof Array){
      for(let i = 0; i < this.props.data.data.length; i++) {
        items.push(this.renderItem(this.props.data.data[i], i))
      }
      return items
    }
    return null
  }


  renderExtra = () => {
    return (
      <View style={[
        {justifyContent: 'space-between', alignItems: 'center'},
        this.isPortrait ? { flexDirection: 'row'} : {flexDirection: 'column'},
      ]}>
        <View
          style={{
            height: dp(22),
            marginLeft: dp(10),
          }}
        >
          {this.props.data.showRatio && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={AppStyle.h3c}>
                {`${getLanguage().SLIDE_RATIO}: `}
              </Text>
              <TextInput
                style={{
                  width: dp(50),
                  padding: 0,
                  borderBottomColor: AppStyle.Color.BLACK,
                  borderBottomWidth: dp(1),
                  textAlign: 'center',
                }}
                returnKeyType ={'done'}
                placeholderTextColor={'black'}
                keyboardType={'numeric'}
                value={this.state.slideRatio + ''}
                defaultValue={this.state.slideRatio + ''}
                onChange={e => {
                  const value = Number(e.nativeEvent.text)
                  if(!isNaN(value) && value >= 0) {
                    this.setState({
                      slideRatio: value
                    })
                  }
                }}
                onEndEditing={() => {
                  if(this.state.slideRatio <= 0) {
                    Toast.show(getLanguage().ONLY_POSITIVE_INTEGER)
                    this.setState({
                      slideRatio: 1
                    })
                  }
                }}
              />
            </View>
          ) }

        </View>

        {this.props.data.apply && (
          // <Button
          //   onPress={() => this.apply(this.props.data.apply)}
          //   title={getText().apply()}
          //   style={{height: dp(30), marginRight: dp(10)}}
          // />
          <></>
        )}
      </View>
    )
  }

  isPortrait = true
  render() {
    return(
      <View style={styles.container}>
        {this.props.data.title && (
          <Text style={{textAlign: 'center'}}>
            {this.props.data.title }
          </Text>
        )}
        <View style={{width: '100%'}} >
          {this.renderItems()}
          {(this.props.data.showRatio || this.props.data.apply) && this.renderExtra()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ToolBarSlide