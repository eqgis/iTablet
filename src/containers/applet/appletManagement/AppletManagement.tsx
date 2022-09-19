/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ScrollView, View, Text, RefreshControl } from 'react-native'
import { scaleSize } from '@/utils'
import { color } from '@/styles'
import { getLanguage } from '@/language'
import { getPublicAssets } from '@/assets'
import {
  Container,
  MTBtn,
} from '@/components'
import { BundleTools, BundleType } from 'imobile_for_reactnative'
// import _mapModules from '@/../configs/mapModules'
import NavigationService from '../../NavigationService'
import AppletItem2 from './AppletItem2'
import { Users } from '@/redux/models/user'

import styles from './styles'
import { Module } from '@/class'

interface Props {
  navigation: any,
  user: Users,
  language: string,
  down: any,

  updateDownList: () => void,
  removeItemOfDownList: () => void,
  setMapModule: () => void,
  addMapModule: (module: Module, cb?: () => void) => Promise<void>,
  loadAddedModule: (moduleKey: string, cb?: () => void) => Promise<void>,
}

interface State {
  data: any[],
  myApplets: any[],
  isRefresh: boolean,
  dynamicModules: any[],
  unusedModules: any[],
}

// const appUtilsModule = NativeModules.appUtilsModule

export default class AppletManagement extends React.Component<Props, State> {

  count = 0
  currentPage = 1
  totalPage = 0
  dataTypes = ['UDB']
  searchParams: {[key: string]: any} | undefined = undefined //其他查询参数

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
      myApplets: [],
      isRefresh: false,
      dynamicModules: [],
      unusedModules: [],
    }
    this.count = 0
    this.currentPage = 1
    this.totalPage = 0
    this.dataTypes = ['UDB']
    this.searchParams = undefined //其他查询参数
  }

  componentDidMount() {
    this.getBundles()
  }

  getBundles = async () => {
    const unusedModules = await BundleTools.getUnusedBundles()
    const files = await BundleTools.getBundles()
    const _files = []
    for (const file of files) {
      if (file.name !== 'iTablet') {
        _files.push(file)
      }
    }
    this.setState({
      unusedModules: unusedModules,
      dynamicModules: _files,
      // myApplets: applets,
    })
  }

  renderItem = (item: BundleType, action: (path: string, bundleType: string) => void) => {
    return (
      <AppletItem2
        key={item.name}
        data={item}
        onPress={data => {
          action(data.path, data.bundleType)
        }}
      />
    )
  }

  renderRows = (data: BundleType[], action: (path: string, bundleType: string) => void) => {
    const applets: any[] = [], column = 4
    let row: any[] = []
    data.forEach((item, index) => {
      row.push(this.renderItem(item, action))
      if (row.length === column || index === data.length - 1) {
        if (row.length < column) {
          const leftNum = row.length
          for (let i = 0; i < column - leftNum; i++) {
            row.push(<View key={'space-' + i} style={styles.btn} />)
          }
        }
        applets.push(<View key={'row-' + applets.length} style={styles.row}>{row}</View>)
        row = []
      }
    })
    return applets
  }

  renderApplets = () => {
    const modules = [<Text key={'unused'}>未加载Bundle</Text>]
    for (const module of this.state.unusedModules) {
      modules.push(this.renderItem(module, path => {
        BundleTools.loadModel(path).then(async result => {
          result && this.getBundles()
        })
      }))
    }
    modules.push(<Text key={'loaded'}>已加载Bundle</Text>)
    for (const module of this.state.dynamicModules) {
      modules.push(this.renderItem(module, (path, bundleType) => {
        BundleTools.openModel(path, bundleType)
      }))
    }
    return modules
  }

  _renderMyApplets = () => {
    return (
      <View style={styles.contentView}>
        <View style={styles.contentHeaderView}>
          <Text style={styles.contentHeaderTitle}>{getLanguage(this.props.language).Profile.MY_APPLET}</Text>
          <MTBtn
            style={{ padding: scaleSize(10) }}
            imageStyle={styles.contentHeaderImg}
            image={getPublicAssets().common.icon_administration}
            onPress={() => {
              NavigationService.navigate('MyApplet', {
                refresh: this.getBundles,
              })
            }}
          />
        </View>
        <View>
          {/* {this._renderRows(this.state.myApplets, true)} */}
          {
            this.renderRows(this.state.dynamicModules, (path, bundleType) => {
              BundleTools.openModel(path, bundleType)
            })
          }
        </View>
      </View>
    )
  }

  _renderUninstallApplets = () => {
    return (
      <View style={styles.contentView}>
        <View style={styles.contentHeaderView}>
          <Text style={styles.contentHeaderTitle}>{getLanguage(this.props.language).Profile.LOCAL_APPLET}</Text>
        </View>
        <View style={styles.rows}>
          {this.renderRows(this.state.unusedModules, path => {
            // 加载小插件bundle包
            BundleTools.loadModel(path).then(result => {
              if (result) {
                // 如已经加载过,则从redux记录中直接放到首页
                this.props.loadAddedModule(result.name)
              }
              result && this.getBundles()
            })
          })}
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container
        style={{
          backgroundColor: color.itemColorGray2,
        }}
        headerProps={{
          title: getLanguage(this.props.language).Find.APPLET,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
            borderBottomWidth: 0,
          },
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.getBundles}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              enabled={true}
            />
          }
        >
          {/* {this.renderApplets()} */}
          {this._renderMyApplets()}
          {this._renderUninstallApplets()}
        </ScrollView>
      </Container>
    )
  }
}
