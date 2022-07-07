import * as React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Platform,
} from 'react-native'
import {  SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { scaleSize } from '../../../../../../utils'
import RadioButton from './RadioButton'
import styles from './styles'

interface DataType {
  confidence?: number,
  label: string,
  check?: boolean,
}

interface Props {
  data: Array<DataType>,
  previewImage?: string,
  onChange: (item: DataType, index: number) => void,
}

interface State {
  selectedData: Map<string, DataType>,
}

/*
 * AI分类
 */
export default class Preview extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    const selectedData = new Map<string, DataType>()
    if (this.props.data.length > 0) {
      selectedData.set(this.props.data[0].label, this.props.data[0])
    }
    this.state = {
      selectedData: selectedData,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  radioButtonOnChange = (item: DataType, index: number) => {
    this.setState(state => {
      const selectedData = new Map().clone(state.selectedData)
      // if (selectedData.has(item.label)) {
      //   selectedData.delete(item.label)
      // } else {
      //   selectedData.set(item.label, item)
      // }
      selectedData.clear()
      selectedData.set(item.label, item)
      return { selectedData }
    })
    this.props.onChange(item, index)
  }

  // renderOverlayPreview = () => {
  //   return (
  //     <View style={styles.preview}>
  //       {<View style={styles.overlayPreviewLeft} />}
  //       {<View style={styles.overlayPreviewTop} />}
  //       {<View style={styles.overlayPreviewRight} />}
  //       {<View style={styles.overlayPreviewBottom} />}
  //       <View
  //         style={{
  //           position: 'absolute',
  //           left: scaleSize(60),
  //           top: scaleSize(145),
  //         }}
  //       >
  //         <View
  //           style={{
  //             height: 2,
  //             width: scaleSize(60),
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //         <View
  //           style={{
  //             height: scaleSize(60),
  //             width: 2,
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           position: 'absolute',
  //           right: scaleSize(61),
  //           top: scaleSize(144),
  //           transform: [{ rotate: '90deg' }],
  //         }}
  //       >
  //         <View
  //           style={{
  //             height: 2,
  //             width: scaleSize(60),
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //         <View
  //           style={{
  //             height: scaleSize(60),
  //             width: 2,
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           position: 'absolute',
  //           left: scaleSize(60),
  //           bottom: scaleSize(600),
  //         }}
  //       >
  //         <View
  //           style={{
  //             height: scaleSize(60),
  //             width: 2,
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //         <View
  //           style={{
  //             height: 2,
  //             width: scaleSize(60),
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           position: 'absolute',
  //           right: scaleSize(61),
  //           bottom: scaleSize(599),
  //           transform: [{ rotate: '-90deg' }],
  //         }}
  //       >
  //         <View
  //           style={{
  //             height: scaleSize(60),
  //             width: 2,
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //         <View
  //           style={{
  //             height: 2,
  //             width: scaleSize(60),
  //             backgroundColor: '#37b44a',
  //           }}
  //         />
  //       </View>
  //     </View>
  //   )
  // }

  renderClassifyTitle = () => {
    return (
      <View style={styles.classifyTitleView}>
        <View style={styles.takeplace} />
        <Text style={styles.title}>
          {
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT
          }
        </Text>
        <Text style={styles.titleConfidence}>
          {
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_CLASSIFY_CONFIDENCE
          }
        </Text>
      </View>
    )
  }

  renderRadio = (item: DataType, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.radioButtonOnChange(item, index)}
        style={styles.classifyTitleView}
      >
        <RadioButton
          checked={this.state.selectedData.has(item.label)}
          onChange={() => {
            this.radioButtonOnChange(item, index)
          }}
        />
        <Text style={styles.title}>{item.label}</Text>
        {
          item.confidence !== undefined &&
          <Text style={styles.titleConfidence}>
            {(item.confidence * 100).toFixed(2) + '%'}
          </Text>
        }
      </TouchableOpacity>
    )
  }

  renderRadios = () => {
    const radios: React.ReactElement[] = []
    this.props.data.forEach((item: DataType, index: number) => {
      radios.push(this.renderRadio(item, index))
    })
    return radios
  }

  renderClassifyInfoView = () => {
    return (
      <View style={styles.InfoChangeView}>
        {this.renderClassifyTitle()}
        {this.renderRadios()}
        {
          this.renderRadio({
            label: getLanguage(global.language).AI.ALL_WRONG,
          }, this.props.data.length)
        }
      </View>
    )
  }

  renderPrevViewImage = () => {
    if (!this.props.previewImage) return null
    let imagePath = this.props.previewImage
    if (
      Platform.OS === 'android' &&
      imagePath.toLowerCase().indexOf('content://') !== 0 &&
      imagePath.toLowerCase().indexOf('file://') !== 0
    ) {
      imagePath = 'file://' + imagePath || ''
    } else {
      imagePath = imagePath || ''
    }
    return (
      <View style={styles.previewImage}>
        <Image
          resizeMode={'contain'}
          source={{ uri: imagePath }}
          style={{ flex: 1 }}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={{
        position: 'absolute',
        // backgroundColor: '#rgba(0, 0, 0, 0)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}>
        {/* {this.renderOverlayPreview()} */}
        {this.renderPrevViewImage()}
        {this.renderClassifyInfoView()}
      </View>
    )
  }
}
