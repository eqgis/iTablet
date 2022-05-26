
import { connect, ConnectedProps } from 'react-redux'
import { Container } from '../../../../../../components'
import { Image, Text, TouchableOpacity, View ,FlatList} from 'react-native'
import { scaleSize, dp, setSpText} from '../../../../../../utils'
import React from 'react'
import { getThemeAssets ,getImage} from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { SARMap,FileTools } from "imobile_for_reactnative"
import { ILocalData } from '../../../../../tabs/Mine/DataHandler/DataLocal'
import NavigationService from '../../../../../NavigationService'
import { Users } from '../../../../../../redux/models/user'
import DataHandler from '../../../../../tabs/Mine/DataHandler'
import ToolbarModule from '../ToolbarModule'
import {
  ConstToolType,
} from '../../../../../../constants'

interface Props {
  language: string,
  navigation: Object,
  user: Users,
  route:any,
}

interface State {
    selectedData:ILocalData[]
    maps:ILocalData[]
}

class MapSelectList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedData:[],
      maps:[],
    }
  }

  componentDidMount() {
    this.init()
  }

  init = async() => {
    const type = this.props.route.params?.type
    if(type === 'mapSelect'){
      const maps = await DataHandler.getLocalData(this.props.user.currentUser, 'MAP')
      this.setState({maps:maps})
    }else{
      const data = await DataHandler.getLocalData(this.props.user.currentUser, 'SANDTABLE')
      this.setState({maps:data})
    }
  }

  /** 图层列表页面的头部 */
  renderHeader = () => {
    let title
    const type = this.props.route.params?.type
    if (type === 'mapSelect') {
      title = getLanguage().CHOOSE_MAP
    }else{
      title = getLanguage().CHOOSE_SANDTABLE
    }
    return (
      <View style={{
        height: dp(60),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: dp(20),
        borderBottomWidth: dp(1),
        borderBottomColor: '#ECECEC',
        marginBottom: dp(12),
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '60%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              NavigationService.goBack()
            }}
          >
            <Image
              style={{
                width: dp(30),
                height:dp(30)
              }}
              source={getImage().back}
            />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            style={{
              fontSize: setSpText(26),
              color: 'black',
            }}
          >
            {title}
          </Text>

        </TouchableOpacity>
        {this.renderHeaderRight()}
      </View>
    )
  }

  /** 图层列表页面右上角的按钮 */
  renderHeaderRight = () => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            marginHorizontal: dp(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={async() => {
            NavigationService.goBack()
            const type = this.props.route.params?.type
            if (type === 'mapSelect') {
              await SARMap.addARBrochoreMap(this.state.selectedData)
              ToolbarModule.addData({ albumName: getLanguage().MAPBROCHORE })
              const _params: any = ToolbarModule.getParams()
              _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_BROCHORE, {
                isFullScreen: false,
              })
            } else {
              const homePath = await FileTools.getHomeDirectory()
              const sandTablePath:string[] = []
              this.state.selectedData.map(item => {
                const path = homePath + item.path + '/' + item.sandTableInfo?.xml
                sandTablePath.push(path)
              })
              ToolbarModule.addData({ sandTablePaths:sandTablePath,albumName: getLanguage().SANDTABLE_ALBUM })
              const _params: any = ToolbarModule.getParams()
              _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_SAND_TABLE_ALBUM, {
                isFullScreen: false,
              })
            }
          }}
        >
          <Text
            style={{
              textAlign: 'center', 
              fontSize: dp(14),
              color: 'black',
            }}
            numberOfLines={1}
          >
            {getLanguage().Common.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderList = () => {
    return (
      <FlatList
        data={this.state.maps}
        renderItem={this.renderItem}
        extraData={this.state}
      />
    )
  }

  renderItem = ({ item }:any) => {
    const type = this.props.route.params?.type
    let name
    if(type === 'mapSelect'){
      name = item.name.substring(0, item.name.lastIndexOf('.'))
    }else{
      name = item.name
    }
    return(
      <TouchableOpacity
        style={[{
          height: scaleSize(80),
          marginLeft: scaleSize(20),
          paddingRight: scaleSize(20),
          borderBottomColor: '#ECECEC',
          borderBottomWidth: scaleSize(1),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }]}
        onPress={() => {
          const index = this.state.selectedData.findIndex(data => {
            return item.name === data.name
          })
          if(index === -1) {
            this.setState({
              selectedData: [...this.state.selectedData, item],
            })
          } else {
            const newArr = this.state.selectedData
            newArr.splice(index, 1)
            this.setState({
              selectedData: newArr,
            })
          }
        }}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View
            style={{
              flex: 1,
              marginLeft: scaleSize(5),
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: setSpText(26),
                color: 'black',
              }}
            >
              {name}
            </Text>
          </View>
        </View>
        {this.renderRight(item)}
      </TouchableOpacity>
    )
  }

  isItemSelected = (item:any) => {
    return this.state.selectedData.some(data => {
      return item.name === data.name
    })
  }

  renderRight = (item:any) => {
    const select =this.isItemSelected(item)
    const icon = select
      ? getThemeAssets().publicAssets.icon_check_in
      : getThemeAssets().publicAssets.icon_check
    return (
      <TouchableOpacity
        style={{
          paddingTop: scaleSize(20),
          paddingBottom: scaleSize(20),
        }}
        onPress={() => {
          const index = this.state.selectedData.findIndex(data => {
            return item.name === data.name
          })
          if(index === -1) {
            this.setState({
              selectedData: [...this.state.selectedData, item],
            })
          } else {
            const newArr = this.state.selectedData
            newArr.splice(index, 1)
            this.setState({
              selectedData: newArr,
            })
          }
        }}
      >
        <Image
          source={icon}
          style={{
            width: scaleSize(40),
            height: scaleSize(40)
          }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <Container
        header={this.renderHeader()}
      >
        {this.renderList()}
      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentGroup: state.cowork.toJS().currentGroup,
})

const mapDispatch = {

}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(MapSelectList)