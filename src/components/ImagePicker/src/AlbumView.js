import React from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Container from '../../Container'
import { getLanguage } from '../../../language'
import { RNFS } from 'imobile_for_reactnative'
import { scaleSize, screen } from '../../../utils'
import { size, color } from '../../../styles'
import Orientation from 'react-native-orientation'
import { ImageUtils } from '.'

export default class AlbumView extends React.PureComponent {
  props: {
    column: number,
  }

  static defaultProps = {
    column: 4,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [...props.route.params.selectedItems],
      orientation: screen.getOrientation(),
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this._onWindowChanged)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._onWindowChanged)
  }

  componentDidUpdate() {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e, orientation) => {
        this.setState({orientation: orientation})
      })
    }
  }

  render() {
    // const safeArea = getSafeAreaInset()
    // const style = {
    //   paddingLeft: safeArea.left,
    //   paddingRight: safeArea.right,
    // }
    return (
      <Container
        style={[
          {
            paddingTop:
              screen.isIphoneX() &&
              this.state.orientation.indexOf('PORTRAIT') >= 0
                ? screen.X_TOP
                : 0,
            paddingBottom: screen.getIphonePaddingBottom(),
            ...screen.getIphonePaddingHorizontal(
              this.state.orientation,
            ),
          },
          styles.view,
        ]}
        showFullInMap={true}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.props.route.params.groupName,
          navigation: this.props.navigation,
          backAction: this._clickBack,
          headerRight: [
            <TouchableOpacity
              key={'addImage'}
              onPress={this._onFinish.bind(this, [])}
            >
              <Text style={styles.headerRight}>
                {getLanguage(global.language).Analyst_Labels.CANCEL}
              </Text>
            </TouchableOpacity>,
          ],
          headerStyle: {
            paddingTop: this.state.orientation.indexOf('LANDSCAPE') !== 0 && (
              screen.isIphoneX()
                ? screen.X_TOP
                : (Platform.OS === 'ios' ? 20 : 0)
            )
          },
        }}
      >
        {/*<NaviBar*/}
        {/*title={this.props.groupName}*/}
        {/*onLeft={this._clickBack}*/}
        {/*rightElement={this.props.cancelLabel}*/}
        {/*onRight={this._onFinish.bind(this, [])}*/}
        {/*/>*/}
        <FlatList
          key={this._column()}
          style={[styles.list]}
          renderItem={this._renderItem}
          data={this.props.route.params.photos}
          keyExtractor={item => item.uri}
          numColumns={this._column()}
          extraData={this.state}
        />
        {this._renderBottomView()}
      </Container>
    )
  }

  renderDuration = sec => {
    let m = 0
    duration = '0'
    if (sec !== null) {
      if (sec > 60) {
        m = Math.floor(sec / 60)
        sec -= 60 * m
      }
      let s = sec.toFixed() - 1 + 1
  
      duration = (m >= 10 ? '' : '0') + m + ':' + (s >= 10 ? '' : '0') + s
    }
    return <Text style={styles.duration}>{duration}</Text>
  }

  _renderItem = ({ item, index }) => {
    // const safeArea = getSafeAreaInset()
    // const edge = (Dimensions.get('window').width - safeArea.left - safeArea.right) / this._column() - 2
    const edge = Dimensions.get('window').width / this._column() - 2
    const isSelected = this.state.selectedItems.some(
      obj => obj.uri === item.uri,
    )
    const backgroundColor = isSelected ? '#e15151' : 'transparent'
    const hasIcon =
      isSelected || this.state.selectedItems.length < this.props.route.params.maxSize
    return (
      <TouchableOpacity onPress={this._clickCell.bind(this, item)}>
        <View style={{ padding: 1 }}>
          <Image
            key={index}
            source={{
              uri:
                (Platform.OS === 'android' &&
                item.uri.indexOf('file://') === -1 &&
                item.uri.indexOf('content://') === -1
                  ? 'file://'
                  : '') + item.uri,
            }}
            style={{ width: edge, height: edge, overflow: 'hidden' }}
            resizeMode="cover"
          />
          {
            item.playableDuration !== null &&
            item.playableDuration >= 0 &&
            item.type.toLowerCase().indexOf('video') >= 0 &&
            this.renderDuration(item.playableDuration)}
          {hasIcon && (
            <View style={styles.selectView}>
              <View style={[styles.selectIcon, { backgroundColor }]}>
                {isSelected && (
                  <Image
                    source={require('./images/check_box.png')}
                    style={styles.selectedIcon}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  _renderBottomView = () => {
    const previewButton =
      this.state.selectedItems.length > 0 ? this.props.route.params.previewLabel : ''
    const okButton =
      getLanguage(global.language).Analyst_Labels.ADD +
      ' (' +
      this.state.selectedItems.length +
      '/' +
      this.props.route.params.maxSize +
      ')'
    // const safeArea = getSafeAreaInset()
    return (
      <View style={[styles.bottom]}>
        {/*<TouchableOpacity onPress={this._clickPreview}>*/}
        {/*<Text style={styles.previewButton}>*/}
        {/*{previewButton}*/}
        {/*</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity onPress={this._clickOk}>
          <Text style={styles.okButton}>{okButton}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _onFinish = data => {
    if (this.props.route.params.autoConvertPath && Platform.OS === 'ios') {
      const promises = data.map((item, index) => {
        const { uri } = item
        const params = uri.split('?')
        if (params.length < 1) {
          throw new Error('Unknown URI：' + uri)
        }
        const keyValues = params[1].split('&')
        if (keyValues.length < 2) {
          throw new Error('Unknown URI：' + uri)
        }
        const kvMaps = keyValues.reduce((prv, cur) => {
          const kv = cur.split('=')
          prv[kv[0]] = kv[1]
          return prv
        }, {})
        const itemId = kvMaps.id
        const ext = kvMaps.ext.toLowerCase()
        const destPath = RNFS.CachesDirectoryPath + '/' + itemId + '.' + ext
        let promise
        if (item.type === 'ALAssetTypePhoto') {
          promise = RNFS.copyAssetsFileIOS(uri, destPath, 0, 0)
        } else if (item.type === 'ALAssetTypeVideo') {
          promise = RNFS.copyAssetsVideoIOS(uri, destPath)
        } else {
          throw new Error('Unknown URI：' + uri)
        }
        return promise.then(resultUri => {
          data[index].uri = resultUri
        })
      })
      Promise.all(promises).then(() => {
        this.props.route.params.callback && this.props.route.params.callback(data)
      })
    } else if (this.props.route.params.autoConvertPath && Platform.OS === 'android') {
      const promises = data.map((item, index) => {
        return RNFS.stat(item.uri).then(result => {
          data[index].uri = result.originalFilepath
        })
      })
      Promise.all(promises).then(() => {
        this.props.route.params.callback && this.props.route.params.callback(data)
      })
    } else {
      this.props.route.params.callback && this.props.route.params.callback(data)
      // this.props.navigation.navigate('MapStack')
      ImageUtils.hide()
    }
  }

  _onDeletePageFinish = data => {
    const selectedItems = this.state.selectedItems.filter(
      item => data.indexOf(item.uri) >= 0,
    )
    this.setState({ selectedItems })
  }

  _clickBack = () => {
    this.props.route.params.onBack && this.props.route.params.onBack(this.state.selectedItems)
    this.props.navigation.goBack()
    // ImageUtils.hide()
  }

  _clickCell = itemuri => {
    const isSelected = this.state.selectedItems.some(
      item => item.uri === itemuri.uri,
    )
    if (isSelected) {
      const selectedItems = this.state.selectedItems.filter(
        item => item.uri !== itemuri.uri,
      )
      this.setState({
        selectedItems: [...selectedItems],
      })
    } else if (this.state.selectedItems.length >= this.props.route.params.maxSize) {
      if (this.props.route.params.maxSize === 1) {
        this.setState({
          selectedItems: [itemuri],
        })
      } else {
        Alert.alert('', this.props.route.params.maxSizeChooseAlert(this.props.route.params.maxSize))
      }
    } else {
      this.setState({
        selectedItems: [...this.state.selectedItems, itemuri],
      })
    }
  }

  // _clickPreview = () => {
  //   if (this.state.selectedItems.length > 0) {
  //     this.props.navigation.navigate(PageKeys.preview, {
  //       ...this.props,
  //       images: this.state.selectedItems,
  //       callback: this._onDeletePageFinish,
  //     })
  //   }
  // }

  _clickOk = () => {
    if (this.state.selectedItems.length > 0) {
      this._onFinish(this.state.selectedItems)
    }
  }

  _column = () => {
    const { width, height } = Dimensions.get('window')
    if (width < height) {
      return this.props.column
    } else {
      // const safeArea = getSafeAreaInset()
      const edge = (height * 1.0) / 3
      return parseInt(width / edge)
      // return parseInt((width - safeArea.left - safeArea.right) / edge)
    }
  }

  _onWindowChanged = () => {
    setTimeout(() => {
      this.forceUpdate()
    }, 100)
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#201F20',
  },
  headerRight: {
    color: color.content,
    minWidth: scaleSize(100),
    fontSize: size.fontSize.fontSizeXXl,
    textAlign: 'right',
  },
  safeView: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  selectView: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 30,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  selectIcon: {
    marginTop: 2,
    marginRight: 2,
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedIcon: {
    width: 13,
    height: 13,
  },
  bottom: {
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  previewButton: {
    marginLeft: 10,
    padding: 5,
    fontSize: 16,
    color: '#666666',
  },
  okButton: {
    marginRight: 15,
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleSize(10),
    borderRadius: 6,
    overflow: 'hidden',
    fontSize: size.fontSize.fontSizeMd,
    color: 'white',
    backgroundColor: '#4680DF',
  },
  duration: {
    position: 'absolute',
    bottom: scaleSize(8),
    right: scaleSize(8),
    color: 'white',
    fontSize: 14,
  },
})
