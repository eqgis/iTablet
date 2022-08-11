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
    // this.getData()
    this.getBundles()
  }

  getBundles = async () => {
    const unusedModules = await BundleTools.getUnusedBundles()
    const files = await BundleTools.getBundles()
    const _files = []
    for (const file of files) {
      if (file.name !== 'iTablet') {
        _files.push(file)
        // for (let index = 0; index < unusedModules.length; index++) {
        //   if (unusedModules[index].name === file.name) {
        //     unusedModules.splice(index, 1)
        //     break
        //   }
        // }
      }
    }
    this.setState({
      unusedModules: unusedModules,
      dynamicModules: _files,
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
        BundleTools.loadModel(path).then(result => {
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
    // return (
    //   <View style={{paddingVertical: 20, flexDirection: 'column'}}>
    //     <Text>已加载Bundle</Text>
    //     {modules}
    //   </View>
    // )
  }

  // getData = async () => {
  //   try {
  //     let { applets, othersApplets } = await this.getMyApplets()

  //     this.currentPage = 1
  //     let data = {}, keywords = (Platform.OS === 'ios' ? 'ios.' : 'android.') + 'bundle'
  //     let searchParams = {
  //       currentPage: this.currentPage,
  //       keywords,
  //     }
  //     if (this.searchParams) {
  //       Object.assign(searchParams, this.searchParams)
  //     }
  //     if (this.dataTypes.length === 0) {
  //       data.total = 0
  //     } else if (!UserType.isProbationUser(this.props.user.currentUser)) {
  //       const onlineService = OnlineServicesUtils.getService()
  //       data = await onlineService.getPublicDataByTypes(
  //         this.dataTypes,
  //         searchParams,
  //       )
  //     }
  //     if (data.total > 0) {
  //       let version = await AppInfo.getBundleVersion()
  //       data.content.map(item => {
  //         let bundleVersion, buildVersion
  //         if (item.fileName.endsWith(keywords + '.zip')) {
  //           let fileName = item.fileName.replace('.' + keywords + '.zip', '')
  //           let arr = fileName.split('_')
  //           if (arr.length >= 3) {
  //             bundleVersion = arr[arr.length - 2]
  //             buildVersion = arr[arr.length - 1]
  //             if (bundleVersion === version.BundleVersion && buildVersion > version.BundleBuildVersion) {
  //               let key = item.fileName.slice(0, item.fileName.indexOf('_'))
  //               if (key && _mapModules.indexOf(key) < 0) {
  //                 othersApplets.push(item)
  //               }
  //             }
  //           }
  //         }
  //       })
  //       if (othersApplets.length > 0) {
  //         this.totalPage = Math.ceil(othersApplets.length / data.pageSize)
  //       }
  //     }
  //     this.setState({ myApplets: applets, data: othersApplets, isRefresh: false })
  //   } catch (error) {
  //     this.setState({ data: [], isRefresh: false })
  //   }
  // }

  // getMyApplets = async () => {
  //   let _applets =
  //     (await ConfigUtils.getApplets(this.props.user.currentUser.userName)) || []
  //   let applets = []
  //   let othersApplets = []

  //   // applets为有序数组
  //   for (let i = 0; i < _applets.length; i++) {
  //     // 检测本地记录中的小程序是否在当前版本中存在
  //     if (_mapModules.indexOf(_applets[i]) >= 0) {
  //       !ChunkType[_applets[i]] &&
  //         applets.push({
  //           fileName: _applets[i],
  //           image: getThemeAssets().mine.my_applets_default,
  //         })
  //     }
  //   }
  //   for (let i = 0; i < _mapModules.length; i++) {
  //     if (_applets.indexOf(_mapModules[i]) < 0 && !ChunkType[_mapModules[i]]) {
  //       othersApplets.push({
  //         fileName: _mapModules[i],
  //         image: getThemeAssets().mine.my_applets_default,
  //       })
  //     }
  //   }
  //   return {
  //     applets,
  //     othersApplets,
  //   }
  // }

  // _renderItem = ({ item, index, disable }) => {
  //   return (
  //     <AppletItem
  //       key={index}
  //       disable={disable}
  //       data={item}
  //       user={this.props.user}
  //       down={this.props.down}
  //       updateDownList={this.props.updateDownList}
  //       removeItemOfDownList={this.props.removeItemOfDownList}
  //       setMapModule={this.props.setMapModule}
  //       refreshData={this.getData}
  //       onDownloaded={result => {
  //         if (result) {
  //           global.SimpleDialog.set({
  //             text: getLanguage(global.language).Find.APPLET_DOWNLOADED_RELOAD,
  //             confirmText: getLanguage(this.props.language).Find.RELOAD,
  //             confirmAction: async () => {
  //               let titleName = ''
  //               if (item.fileName) {
  //                 let index = item.fileName.lastIndexOf('.')
  //                 titleName =
  //                   index === -1
  //                     ? item.fileName
  //                     : item.fileName.substring(0, index)
  //                 const suffix = (Platform.OS === 'ios' ? '.ios' : '.android') + '.bundle'
  //                 if (titleName.endsWith(suffix)) {
  //                   titleName = titleName.replace(suffix, '')
  //                 }
  //               }
  //               let arr = []
  //               for (let applet of this.state.myApplets) {
  //                 arr.push(applet.fileName)
  //               }
  //               arr.push(titleName)
  //               arr = [...new Set(arr)]
  //               await ConfigUtils.recordApplets(this.props.user.currentUser.userName, arr)
  //               appUtilsModule.reloadBundle()
  //             },
  //           })
  //           global.SimpleDialog.setVisible(true)
  //         } else {
  //           Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_SUCCESSFULLY)
  //         }
  //       }}
  //     />
  //   )
  // }

  // _renderRows = (data, disable) => {
  //   let applets = [], row = [], column = 4
  //   data.forEach((item, index) => {
  //     row.push(this._renderItem({ item, index, disable }))
  //     if (row.length === column || index === data.length - 1) {
  //       if (row.length < column) {
  //         let leftNum = row.length
  //         for (let i = 0; i < column - leftNum; i++) {
  //           row.push(<View key={'space-' + i} style={styles.btn} />)
  //         }
  //       }
  //       applets.push(<View key={'row-' + applets.length} style={styles.row}>{row}</View>)
  //       row = []
  //     }
  //   })
  //   return applets
  // }

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
              // NavigationService.navigate('AppletList', {
              //   data: this.state.myApplets,
              //   refresh: this.getBundles,
              // })
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
              console.warn(2, path, bundleType)
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
          {/* {this._renderRows(this.state.data, false)} */}
          {this.renderRows(this.state.unusedModules, path => {
            // this.props.addMapModule(new TourModule())
            BundleTools.loadModel(path).then(result => {
              console.warn(1, result)
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
