import * as React from 'react'
import { View, FlatList, TouchableOpacity, Text, Image ,Platform,StyleSheet} from 'react-native'
import { scaleSize, setSpText, Toast, LayerUtils ,DialogUtils} from '../../utils'
import { color } from '../../styles'
import NavigationService from '../NavigationService'
import { SMap, DatasetType } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import { Container } from '../../components'
import { getThemeAssets,getLayerWhiteIconByType ,getPublicAssets,getLayerIconByType} from '../../assets'

import { getLanguage } from '../../language'
import { LayerManager_tolbar } from '../mtLayerManager/components/LayerManager_tolbar'
import { OverlayView } from '../workspace/components'

export default class ChooseNaviLayer extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    setCurrentLayer: PropTypes.func,
    getLayers: PropTypes.func,
    device:PropTypes.object,
    currentLayer:PropTypes.object,
  }

  props: {
    navigation: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedItem: GLOBAL.INCREMENT_DATA || {},
    }
    this.clickAble = true // 防止重复点击
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let dataList = await SMap.getLineDataset()
    this.setState({
      data: dataList,
    })
  }


  _onPress = async item => {
    let selectedItem = this.state.selectedItem
    if (
      selectedItem.datasetName !== item.datasetName ||
      selectedItem.datasourceName !== item.datasourceName
    ) {
      this.setState({
        selectedItem: item,
      })
    }
  }

  /**
 * 删除数据集
 * @param {*} param0.index 数据集在FlatList的data数组元素中的序号
 */
  _onDeletePress = async index => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let deleteData = data.splice(index, 1)
    let { datasourceName, datasetName } = deleteData[0]
    //如果删除的是当前选中 自动选中下一个
    let selectedItem = this.state.selectedItem
    let removeLayer = false
    GLOBAL.INCREMENT_DATA = this.item
    if (
      selectedItem.datasourceName === datasourceName &&
      selectedItem.datasetName === datasetName
    ) {
      selectedItem = {}
    }
    if (
      GLOBAL.INCREMENT_DATA.datasourceName === datasourceName &&
      GLOBAL.INCREMENT_DATA.datasetName === datasetName
    ) {
      removeLayer = true
      GLOBAL.INCREMENT_DATA = {}
    }
    await SMap.deleteDatasetAndLayer({ datasourceName, datasetName, removeLayer })
    this.setState({
      data,
      selectedItem,
    })
  }

  /**
   * 完成编辑数据集名称
   * @param {Number} param0.index 序号
   * @param {String} param0.text 编辑的文字
   */
    _endEditing = ({ index, text }) => {
      let data = JSON.parse(JSON.stringify(this.state.data))
      let regExp = /^[a-zA-Z0-9@#_]+$/
      let isValid = regExp.test(text)
      if (isValid) {
        let { datasourceName, datasetName } = data[index]
        data[index].datasetName = text
        let selectedItem = JSON.parse(JSON.stringify(this.state.selectedItem))
        selectedItem.datasetName = text
        //更新datasteName
        SMap.modifyDatasetName({
          datasourceName,
          datasetName,
          newDatasetName: text,
        })
        this.setState({
          data,
          selectedItem,
        })
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.DATASET_RENAME_FAILED)
      }
    }

    createDataset = async ({ text }) => {
      let regExp = /^[a-zA-Z0-9@#_]+$/
      let isValid = regExp.test(text)
      if (isValid) {
        await SMap.createNaviDataset(text,GLOBAL.INCREMENT_DATA.layerName).then(async returnData => {
          if (returnData.datasetName) {
            GLOBAL.INCREMENT_DATA = returnData
            this.setState({selectedItem:returnData})
            this.getData()
          }
        })
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.DATASET_RENAME_FAILED)
      }
    }

  _onMorePress = ({ index , item}) => {
    this.index = index
    this.item = item
    this.toolBox.setVisible(true, "NAVI_LAYER")
  }

  onPress = title => {
    if(title === getLanguage(GLOBAL.language).Map_Layer.LAYERS_REMOVE){
      this._onDeletePress(this.index)
      this.toolBox.setVisible(false)
    }else if (
      title ===
      getLanguage(GLOBAL.language).Map_Layer.LAYERS_FULL_VIEW_LAYER
    ) {
      //'全幅显示当前图层') {
      (async function () {
        await SMap.setLayerFullView(this.state.selectedItem.layerName)
        await SMap.refreshMap()
      }.bind(this)())
      this.toolBox.setVisible(false)
      NavigationService.goBack()
    }else if (
      title ===
      getLanguage(GLOBAL.language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER
    ) {
      this.toolBox.setVisible(false)
      let selectedItem = this.state.selectedItem
      if (
        selectedItem.datasetName !== this.item.datasetName ||
        selectedItem.datasourceName !== this.item.datasourceName
      ) {
        this.setState({
          selectedItem: this.item,
        })
      }
      if (
        GLOBAL.INCREMENT_DATA.datasetName !==
        this.item.datasetName ||
        GLOBAL.INCREMENT_DATA.datasourceName !==
        this.item.datasourceName
      ) {
        (async function () {
          let params = {
            preDatasetName: GLOBAL.INCREMENT_DATA.datasetName || '',
            datasourceName: this.item.datasourceName,
            datasetName: this.item.datasetName,
          }
          await SMap.setCurrentDataset(params)
          GLOBAL.INCREMENT_DATA = this.item
        }.bind(this)())
      }
    }else if (
      title === getLanguage(GLOBAL.language).Map_Layer.LAYERS_RENAME
    ) {
      DialogUtils.showInputDailog({
        label: 'input',
        placeholder: this.item.datasetName,
        value: this.item.datasetName,
        legalCheck: true,
        type: 'name',
        confirmAction: text => {
          let index = this.index
          this._endEditing({ index, text })
          DialogUtils.hideInputDailog()
          this.toolBox.setVisible(false)
        },
      })
    }else if (
      title === getLanguage(GLOBAL.language).Map_Main_Menu.ADD_DATASET
    ){
      NavigationService.navigate('ChooseNaviDataImport',{sourceData:this.item})
    }
  }

  _renderItem = ({ item ,index}) => {
    let hasExtra =
      this.state.selectedItem.datasourceName === item.datasourceName &&
      this.state.selectedItem.datasetName === item.datasetName
    let extraStyle, extraTxtStyle
    let moreImg
    if (hasExtra) {
      extraStyle = { backgroundColor: color.item_selected_bg }
      extraTxtStyle = { color: color.white }
      moreImg = getThemeAssets().publicAssets.icon_move_selected
    } else {
      extraStyle = {}
      extraTxtStyle = {}
      moreImg = getThemeAssets().publicAssets.icon_move
    }
    return (
      <View>
        <TouchableOpacity
          style={[{
            paddingLeft: scaleSize(14),
            height: scaleSize(80),
            padding: scaleSize(6),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
          },extraStyle]}
          onPress={async () => {
            this._onPress(item)
          }}
        >
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                height: scaleSize(50),
                width: scaleSize(60),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                style={{
                  height: scaleSize(40),
                  width: scaleSize(40),
                }}
                source={getThemeAssets().layerType.layer_line}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: scaleSize(30),
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={[{
                fontSize: setSpText(24),
                color: color.black,
                backgroundColor: 'transparent',
              },extraTxtStyle]}
            >
              {item.datasetName}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              marginRight: scaleSize(10),
              backgroundColor: 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent:'flex-end',
            }}
          >
            <TouchableOpacity
              style={styles.imageWrap}
              onPress={() => {
                this._onMorePress({ index , item})
              }}
            >
              <Image
                source={moreImg}
                resizeMode={'contain'}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  back = async() => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      if(this.state.selectedItem.datasetName){
        if (
          GLOBAL.INCREMENT_DATA.datasetName !==
          this.state.selectedItem.datasetName ||
          GLOBAL.INCREMENT_DATA.datasourceName !==
          this.state.selectedItem.datasourceName
        ) {
          (async function () {
            let params = {
              preDatasetName: GLOBAL.INCREMENT_DATA.datasetName || '',
              datasourceName: this.state.selectedItem.datasourceName,
              datasetName: this.state.selectedItem.datasetName,
            }
            await SMap.setCurrentDataset(params)
            GLOBAL.INCREMENT_DATA = this.state.selectedItem
          }.bind(this)())
        }
      }
      NavigationService.goBack()
    }
  }

  /**行与行之间的分隔线组件 */
  renderItemSeparator = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          marginLeft: scaleSize(84),
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  //遮盖层
  renderOverLayer = () => {
    return <OverlayView ref={ref => (GLOBAL.NaviLayerOverlayView = ref)} />
  }

  renderTool = () => {
    return (
      <LayerManager_tolbar
        language={this.props.language}
        currentLayer={this.props.currentLayer}
        ref={ref => (this.toolBox = ref)}
        updateData={this.getData}
        getLayers={this.props.getLayers}
        setCurrentLayer={this.props.setCurrentLayer}
        device={this.props.device}
        user={this.props.user}
        navigation={this.props.navigation}
        Onavipress={this.onPress}
      />
    )
  }
  renderHeaderRight = () => {
    let addImage = getPublicAssets().common.icon_add
    return (
      <View
        style={{flexDirection: 'row'}}
      >
        <TouchableOpacity
          style={styles.imageWrap}
          onPress={async () => {
            DialogUtils.showInputDailog({
              label: 'input',
              legalCheck: true,
              type: 'name',
              confirmAction: text => {
                this.createDataset({ text })
                DialogUtils.hideInputDailog()
              },
            })
          }}
        >
          <Image
            source={addImage}
            resizeMode={'contain'}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color.background,
        }}
      >
        <Container
          ref={ref => (this.container = ref)}
          headerProps={{
            title: getLanguage(this.props.language).Prompt.CHOOSE_LAYER,
            backAction: this.back,
            headerRight: this.renderHeaderRight(),
          }}
        >
          <FlatList
            data={this.state.data}
            renderItem={this._renderItem}
            extraData={this.state}
            ItemSeparatorComponent={this.renderItemSeparator}
          />
          {this.renderOverLayer()}
          {this.renderTool()}
        </Container>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  padding: {
    paddingHorizontal: scaleSize(10),
    paddingBottom: scaleSize(10),
  },
  title: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#303030',
    backgroundColor: color.white,
  },
  titleTxt: {
    color: color.fontColorBlack,
    fontSize: setSpText(22),
    flex: 1,
    textAlign: 'center',
  },
  actionTxt: {
    color: color.fontColorBlack,
    fontSize: setSpText(20),
  },
  titleTxtWrap: {
    // width: scaleSize(120),
    minWidth: scaleSize(110),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
    flex: -1,
  },
  sectionSeparateViewStyle: {
    height: scaleSize(2),
    marginHorizontal: scaleSize(30),
    backgroundColor: color.separateColorGray4,
  },
  section: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.content_white,
    marginHorizontal: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.separateColorGray4,
  },
  row: {
    height: scaleSize(61),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scaleSize(20),
    paddingLeft: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.separateColorGray4,
  },
  imageWrap: {
    marginLeft:scaleSize(10),
    width: scaleSize(60),
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  text: {
    flex: 1,
    fontSize: setSpText(18),
  },
  input: {
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  flex: {
    flex: 1,
  },
})