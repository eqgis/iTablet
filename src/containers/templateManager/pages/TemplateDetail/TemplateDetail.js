/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View } from 'react-native'
import {
  Container,
  TextBtn,
  ImageButton,
  PopMenu,
  Dialog,
  InputDialog,
} from '../../../../components'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import { screen, scaleSize } from '../../../../utils'
import { ConstToolType } from '../../../../constants'
import { size, color } from '../../../../styles'
import { ListSeparator, TreeList, TreeListItem } from '../../../../components'
import { TemplatePopView } from '../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import NavigationService from '../../../NavigationService'
import { XMLUtil } from '../../utils'
import { FileTools } from '../../../../native'
import ConstPath from '../../../../constants/ConstPath'
import fs from 'react-native-fs'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'

export default class TemplateDetail extends React.Component {
  props: {
    language: string,
    navigation: Object,
    device: Object,
    nav: Object,
    map: Array,
    currentUser: string,
    layers: Array,
    getLayers: () => {},
    setSymbolTemplates: () => {},
  }

  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params || {}

    let defaultData = [
      {
        code: '0100',
        name: 'NewFeature',
        datasourceAlias: '',
        datasetName: '',
        type: '',
        fields: [],
        childGroups: [],
      },
    ]

    this.path = params.path || ''
    this.oldData = params.data || {}
    this.state = {
      title:
        params.title ||
        getLanguage(this.props.language).Template.COLLECTION_TEMPLATE_CREATE,
      data: params.data && JSON.parse(JSON.stringify(params.data)) || defaultData,
      datasources: [],
      datasets: [],
      popData: [],
    }
  }

  componentDidMount() {}

  _getItemPopupData = () => {
    return [
      {
        title: getLanguage(this.props.language).Template.CREATE_ROOT_NODE,
        action: () => {
          let newState = this.state.data.concat({
            code: this.dealCode('0100', this.state.data.length),
            name: 'NewFeature' + this.state.data.length,
            datasourceAlias: '',
            datasetName: '',
            type: '',
            fields: [],
            childGroups: [],
          })
          this.setState({
            data: newState,
          })
        },
      },
      {
        title: getLanguage(this.props.language).Template.CREATE_CHILD_NODE,
        action: () => {
          let newId =
            '_' +
            (this.currentItem.childGroups && this.currentItem.childGroups.length
              ? this.currentItem.childGroups.length
              : 0)
          if (!this.currentItem.childGroups) this.currentItem.childGroups = []
          this.currentItem.childGroups.push({
            // code: this.dealCode(this.currentItem.code, newId),
            code: '0100' + newId,
            name: 'NewFeature' + newId,
            datasourceAlias: '',
            datasetName: '',
            type: '',
            fields: [],
            childGroups: [],
          })
          let newData = this.state.data.concat()

          this.setState({
            data: newData,
          })
        },
      },
      {
        title: getLanguage(this.props.language).Template.INSERT_NODE,
        action: () => {
          let newId = '',
            _data = []
          if (this.currentItem.parent) {
            _data = this.currentItem.parent.childGroups
            newId = _data.length ? '_' + _data.length : ''
          } else {
            _data = this.state.data
            newId = _data.length
          }
          let index = 0
          for (let i = 0; i < _data.length; i++) {
            if (
              _data[i].code === this.currentItem.code ||
              _data[i].name === this.currentItem.name
            ) {
              index = i
            }
          }

          _data.splice(index + 1, 0, {
            code: this.currentItem.code + newId,
            name: 'NewFeature' + newId,
            datasourceAlias: '',
            datasetName: '',
            type: '',
            fields: [],
            childGroups: [],
          })
          this.setState({
            data: this.state.data.concat(),
          })
        },
      },
    ]
  }

  dealCode = (code = 0, id = 0) => {
    let newCode = parseInt(code) + parseInt(id) + ''
    if (newCode.length < 4) {
      let zeros = ''
      for (let i = 0; i < 4 - newCode.length; i++) {
        zeros += '0'
      }
      newCode = zeros + newCode
    }
    return newCode
  }

  deleteItem = () => {
    let _data = [],
      data = this.currentItem
    if (data.parent) {
      _data = data.parent.childGroups
    } else {
      _data = this.state.data
    }
    for (let i = 0; i < _data.length; i++) {
      if (_data[i].code === data.code && _data[i].name === data.name) {
        _data.splice(i, 1)
        break
      }
    }
    this.setState({
      data: this.state.data.concat(),
    })
    this.deleteDialog && this.deleteDialog.setDialogVisible(false)
  }

  confirm = async () => {
    let params = this.props.navigation.state.params || {}
    if (params.title) {
      this.goBack({
        title: params.title,
        data: await XMLUtil.obj2Xml(params.title, this.state.data),
      })
    } else {
      this.dialog && this.dialog.setDialogVisible(true)
    }
  }

  goBack = async (data = {}) => {
    let path = this.path
    if (data.title) {
      path =
        (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
        this.props.currentUser.userName +
        '/' +
        ConstPath.RelativePath.Template +
        data.title +
        '.xml'
    }
    let xmlObj

    if (data.data) {
      // 编辑已有的template文件
      let oldXmlObj = XMLUtil.obj2Xml(data.title, this.oldData)
      if (JSON.stringify(data.data) !== JSON.stringify(oldXmlObj)) {
        let res = await XMLUtil.writeXML(path, this.state.data)
        if (res.result) {
          xmlObj = res.xmlObj
        }
      } else {
        xmlObj = data.data
      }
    } else if (data.title) {
      // 新建template文件
      let res = await XMLUtil.writeXML(path, this.state.data)
      if (res.result) {
        xmlObj = res.xmlObj
      }
    }

    if (xmlObj) {
      const homePath = await FileTools.appendingHomeDirectory()
      const mapXml = homePath + this.props.map.currentMap.path
      const expFilePath = `${mapXml.substr(0, mapXml.lastIndexOf('.'))}.exp`
      const expIsExist = await FileTools.fileIsExist(expFilePath)
      let relativeTemplatePath
      if (expIsExist) {
        let expData = JSON.parse(await fs.readFile(expFilePath))
        relativeTemplatePath = path.replace(homePath + ConstPath.UserPath, '')
        // 若exp文件中Template不存在，或者和当前模板目录不相同，则改写文件
        if (
          expData &&
          (!expData.Template || expData.Template !== relativeTemplatePath)
        ) {
          expData.Template = relativeTemplatePath
          await fs.writeFile(expFilePath, JSON.stringify(expData), 'utf8')
        }
      }

      let params = this.props.navigation.state.params
      if (params && params.cb && typeof params.cb === 'function') {
        params.cb()
      }

      NavigationService.goBack('TemplateManager')
      // 修改地图信息中的Template
      let map = this.props.map.currentMap
      map.Template = relativeTemplatePath
      this.props.setCurrentMap(map)
      // 修改redux采集模板
      this.props.setSymbolTemplates({
        path: path,
        data: xmlObj,
        name: data.title,
      })
      if (
        ToolbarModule.getData().actions &&
        ToolbarModule.getData().actions.openTemplate
      ) {
        ToolbarModule.getData().actions.openTemplate(ConstToolType.COLLECTION)
      }
    }
  }

  popViewConfirm = data => {
    // 要素设置
    this.currentItem.name = data[0].data[0].value
    this.currentItem.code = data[0].data[1].value
    this.currentItem.title = `${this.currentItem.code} ${this.currentItem.name}`
    // 要素储存
    this.currentItem.datasourceAlias = data[1].data[0].value
    // this.currentItem.datasetName = data[1].data[1].data.datasetName
    this.currentItem.datasetName = data[1].data[1].value
    this.currentItem.type = data[1].data[1].type
    // this.currentItem.data = data[1].data[1].data
    // 属性设置
    this.currentItem.fields = data[2].data

    this.setState({
      data: this.state.data.concat(),
    })
    this.popView && this.popView.setVisible(false)
  }

  onItemPress = ({ data, index }) => {
    this.currentItem = data
    let popData = [
      {
        title: getLanguage(this.props.language).Template.ELEMENT_SETTINGS,
        data: [
          {
            name: getLanguage(this.props.language).Template.ELEMENT_NAME,
            value: data.name,
            rightType: 'input',
          },
          {
            name: getLanguage(this.props.language).Template.ELEMENT_CODE,
            value: data.code,
            rightType: 'input',
          },
        ],
      },
      {
        title: getLanguage(this.props.language).Template.ELEMENT_STORAGE,
        data: [
          {
            name: getLanguage(this.props.language).Map_Settings.DATASOURCES,
            value: data.datasourceAlias,
          },
          {
            name: getLanguage(this.props.language).Map_Settings.DATASETS,
            value: data.datasetName,
            type: data.type,
          },
        ],
      },
      {
        title: getLanguage(this.props.language).Template.ATTRIBUTE_SETTINGS,
        data: data.fields,
      },
    ]
    this.setState(
      {
        popData: popData,
      },
      () => this.popView && this.popView.setVisible(true),
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  renderList = () => {
    return <TreeList data={this.state.data} renderItem={this.renderItem} />
  }

  renderItem = ({ data, index, parent }) => {
    data.title = `${data.code} ${data.name}`
    data.parent = parent
    data.id = parent ? (parent.id || parent.code) + '_' + data.code : data.code
    let key = parent ? parent.code + '_' + data.code : data.code
    return (
      <TreeListItem
        parent={parent}
        data={data}
        index={index}
        key={key}
        style={[styles.row, styles.listItem]}
        textColor={color.themeText2}
        fontSize={size.fontSize.fontSizeXl}
        rightView={({ data, index }) => {
          return (
            <View style={styles.itemRightView}>
              <ImageButton
                iconBtnStyle={styles.bottomBtnView}
                iconStyle={styles.selectImg}
                icon={getPublicAssets().plot.plot_add}
                onPress={event => {
                  this.currentItem = data
                  this.PagePopModal.setVisible(true, {
                    x: event.nativeEvent.pageX,
                    y: event.nativeEvent.pageY,
                  })
                }}
              />
              <ImageButton
                iconBtnStyle={styles.bottomBtnView}
                iconStyle={styles.selectImg}
                icon={getThemeAssets().attribute.icon_delete}
                onPress={() => {
                  this.currentItem = data
                  this.deleteDialog && this.deleteDialog.setDialogVisible(true)
                }}
              />
            </View>
          )
        }}
        childrenStyle={[styles.children]}
        // childrenData={row.childGroups}
        keyExtractor={data => data.path}
        renderChild={this.renderItem}
        onPress={this.onItemPress}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        navigation={this.props.navigation}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Prompt.COMPLETE}
              textStyle={styles.headerBtnTitle}
              width={scaleSize(80)}
              height={scaleSize(40)}
              btnClick={this.confirm}
            />
          ),
        }}
      >
        {this.renderList()}
        <TemplatePopView
          ref={ref => (this.popView = ref)}
          data={this.state.popData}
          language={this.props.language}
          height={
            (screen.getScreenHeight(this.props.device.orientation) * 3) / 4
          }
          confirm={this.popViewConfirm}
        />
        <PopMenu
          ref={ref => (this.PagePopModal = ref)}
          getData={this._getItemPopupData}
          device={this.props.device}
          hasCancel={false}
        />
        <Dialog
          ref={ref => (this.deleteDialog = ref)}
          type={Dialog.Type.MODAL}
          title={this.state.dialogTitle}
          confirmAction={this.deleteItem}
          info={getLanguage(this.props.language).Prompt.DELETE_CONFIRM}
          opacityStyle={styles.dialogStyle}
          confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
          cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        />
        <InputDialog
          ref={ref => (this.dialog = ref)}
          title={
            getLanguage(this.props.language).Template.COLLECTION_TEMPLATE_NAME
          }
          confirmAction={async value => {
            await this.goBack({
              title: value,
            })
            this.dialog.setDialogVisible(false)
          }}
          confirmBtnTitle={getLanguage(GLOBAL.language).Map_Settings.CONFIRM}
          cancelBtnTitle={getLanguage(GLOBAL.language).Map_Settings.CANCEL}
        />
      </Container>
    )
  }
}
