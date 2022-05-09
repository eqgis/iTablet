import { SARMap } from 'imobile_for_reactnative'
import { AIDetectStyle } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import React from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { Container, Slider, SwitchItem } from '../../components'
import { getLanguage } from '../../language'
import { dp } from '../../utils'
import { color, size } from '../../styles'

interface Props {
  navigation: any,
}

interface State {
  inited: boolean,
  /** 置信度，范围：0 -100 */
  confidence: number,
}

class AIDetectSettingView extends React.Component<Props, State> {

  container: typeof Container
  defautConfidence: number | undefined | null
  currentConfidence = 0

  labels: string[] = []
  filter: number[] = []
  style: AIDetectStyle | undefined = undefined

  constructor(props: Props) {
    super(props)
    this.state={
      inited: false,
      confidence: 0,
    }

  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      this.container?.setLoading(true, getLanguage().Prompt.LOADING)
      const results = await Promise.all([
        SARMap.getAIDetectConfidence(),
        SARMap.getAIDetectLabels(),
        SARMap.getAIDetectFilter(),
        SARMap.getAIDetectStyle(),
      ])
      this.defautConfidence = Math.round(results[0] * 100)
      this.labels = results[1]
      this.filter = results[2]
      this.style = results[3]
      this.setState({
        inited: true,
        confidence: this.defautConfidence,
      }, () => {
        this.container?.setLoading(false)
      })
    } catch (error) {
      this.container?.setLoading(false)
    }
  }

  enableLabel = (label: string, enable: boolean) => {
    SARMap.enableAIDetectLabel(label, enable)
  }

  renderConfidece = () => {
    return (
      <Slider
        leftText={getLanguage().Map_Settings.CONFIDENCE}
        defaultValue={this.defautConfidence || 0}
        unit={'%'}
        onMove={(value: number) => {
          this.currentConfidence = value
          this.setState({
            confidence: value,
          })
        }}
        onEnd={() => {
          SARMap.setAIDetectConfidence(this.currentConfidence/100)
        }}
      />
    )
  }

  renderCommonSettings = () => {
    return (
      <View style={styles.settingView}>
        <Text style={styles.commonSettingTitle}>{getLanguage().Map_Layer.ADD_ATTRIBUTE_FOR_LAYER}</Text>
        {this.renderConfidece()}
      </View>
    )
  }

  renderStyle = () => {
    return (
      <View style={styles.settingView}>
        <SwitchItem
          text={getLanguage().Map_Settings.DETECT_STYLE_IS_DRAW_TITLE}
          value={!!this.style?.isDrawTitle}
          onPress={value => {
            SARMap.setAIDetectStyle({isDrawTitle: value})
          }}
        />
        <SwitchItem
          text={getLanguage().Map_Settings.DETECT_STYLE_IS_DRAW_CONFIDENCE}
          value={!!this.style?.isDrawConfidence}
          onPress={value => {
            SARMap.setAIDetectStyle({isDrawConfidence: value})
          }}
        />
        <SwitchItem
          text={getLanguage().Map_Settings.COUNTRACKED}
          value={!!this.style?.isDrawCount}
          onPress={value => {
            SARMap.setAIDetectStyle({isDrawCount: value})
          }}
        />
      </View>
    )
  }

  renderFilters = () => {
    return (
      <View style={styles.settingView}>
        {this.labels.map((item, index) => {
          if(item !== '???' && item !== '') {
            return (
              <SwitchItem
                key={index + ''}
                text={item}
                value={this.filter.filter(idx => idx === index).length === 0}
                onPress={value => {
                  this.enableLabel(item, value)
                }}
              />
            )
          }
        })}
      </View>
    )
  }

  render() {
    return(
      <Container
        ref={(ref: typeof Container) => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: getLanguage().Map_Settings.DETECT_TYPE,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView style={styles.scrollView}>
          {this.state.inited && this.renderCommonSettings()}
          {this.state.inited && this.renderStyle()}
          {this.state.inited && this.renderFilters()}
        </ScrollView>
      </Container>
    )
  }
}

export default AIDetectSettingView

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgW,
  },
  scrollView: {
    // backgroundColor: color.bgW,
    paddingBottom: dp(20),
  },
  commonSettingTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray3,
    marginTop: dp(8),
    marginBottom: dp(20),
    marginLeft: dp(10),
    paddingRight: dp(16),
  },
  settingView: {
    backgroundColor: color.white,
    marginTop: dp(20),
    marginHorizontal: dp(20),
    borderRadius: dp(10),
    padding: dp(10),
  },
  layerView: {
    flex: 1,
    backgroundColor: color.white,
    marginTop: dp(20),
    marginHorizontal: dp(20),
    borderRadius: dp(10),
  },
})

