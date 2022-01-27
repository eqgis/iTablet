/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native'

import NavigationService from '../../../NavigationService'
import { Toast, scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'
import { getPinYinFirstCharacter } from '../../../../utils/pinyin'
import FriendListFileHandle from '../FriendListFileHandle'
// eslint-disable-next-line
import { ActionPopover } from 'teaset'
import { getLanguage } from '../../../../language/index'

export interface FriendInfo {
  id: string,
  markName: string,
  name: string,
  info: {
    isFriend: boolean,
  },
}

class FriendList extends Component {
  props: {
    language: String,
    // navigation: Object,
    user: Object,
    // friend: Object,
    callBack: (friend: FriendInfo) => void,
  }

  constructor(props) {
    super(props)
    this.state = {
      sections: [], //section数组
      listData: [], //源数组
      letterArr: [], //首字母数组
      isRefresh: false,
      inputText: '',
    }

    this._renderSectionHeader = this._renderSectionHeader.bind(this)
  }

  componentDidMount() {
    this.getContacts()
  }

  refresh = () => {
    this.getContacts()
    this.setState({ isRefresh: false })
  }

  download = () => {
    FriendListFileHandle.initFriendList(this.props.user)
    this.setState({ isRefresh: false })
  }

  getContacts = async () => {
    let results = FriendListFileHandle.getFriendList()
    if (results) {
      let result = results.userInfo
      try {
        // let data =  API.app.contactlist();     //获取联系人列表
        // const {list} = data;

        let srcFriendData = []
        for (let key = 0; key < result.length; key++) {
          if (result[key].id && result[key].name) {
            let frend = {}
            frend['id'] = result[key].id
            frend['markName'] = result[key].markName
            frend['name'] = result[key].name
            frend['info'] = result[key].info
            if (frend['info'].isFriend !== 2 && this.props.user.userName !== result[key].name) {
              srcFriendData.push(frend)
            }
          }
        }

        let sections = [],
          letterArr = []

        for (let i = 0; i < srcFriendData.length; i++) {
          let person = srcFriendData[i]
          let name = person['markName']
          let firstChar = getPinYinFirstCharacter(name, '-', true)
          let ch = firstChar[0]
          if (letterArr.indexOf(ch) === -1) {
            letterArr.push(ch)
          }
        }

        letterArr.sort()

        // eslint-disable-next-line
        letterArr.map((item, index) => {
          const module = srcFriendData.filter(it => {
            //遍历获取每一个首字母对应联系人
            let firstChar = getPinYinFirstCharacter(it['markName'], '-', true)
            let ch = firstChar[0]
            return ch === item
          })

          sections.push({ key: item, title: item, data: module })
        })

        this.setState({
          letterArr,
          sections,
        })
        // eslint-disable-next-line
      } catch (err) {
        //console.log('err', err)
        Toast.show(err.message)
      }
    } else {
      this.setState({
        letterArr: [],
        sections: [],
      })
    }
  }

  _onFriendSelect = item => {
    if (this.props.callBack !== undefined) {
      this.props.callBack(item)
    } else {
      NavigationService.navigate('Chat', {
        targetId: item.id,
      })
    }
  }
  _onSectionselect = key => {
    //滚动到指定的偏移的位置
    this.SectionList.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: key,
      viewOffset: scaleSize(35),
    })
    // this.refs._sectionList.scrollToOffset({animated: true, offset: offset});
  }

  render() {
    const { letterArr, sections } = this.state
    //偏移量 = （设备高度 - 字母索引高度 - 底部导航栏 - 顶部标题栏 - 24）/ 2
    // const top_offset = (Dimensions.get('window').height - letterArr.length*scaleSize(35) - 24) / 2;

    return (
      <View
        style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}
      >
        <SectionList
          style={{flex: 1}}
          ref={ref => (this.SectionList = ref)}
          renderSectionHeader={this._renderSectionHeader}
          sections={sections}
          keyExtractor={(item, index) => index}
          numColumns={1}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          // ListEmptyComponent={() => (
          //   <View
          //     style={{
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //       marginTop: scaleSize(50),
          //     }}
          //   >
          //     <Text style={{ fontSize: scaleSize(30), textAlign: 'center' }}>
          //       {/* 您还未添加好友哦 */}
          //       {getLanguage(this.props.language).Friends.NO_FRIEND}
          //     </Text>
          //   </View>
          // )} // 数据为空时调用
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.download}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(this.props.language).Friends.LOADING}
              enabled={true}
            />
          }
          ListFooterComponent={<View style={{height:0}}/>}
        />
        {this.state.sections.length > 30 && (
          <View style={styles.FlatListViewStyle}>
            <FlatList
              data={letterArr}
              keyExtractor={(item, index) => index.toString()} //不重复的key
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.FlatListItemViewStyle}
                  onPress={() => {
                    this._onSectionselect(index)
                  }}
                >
                  <Text style={{ fontSize: scaleSize(25) }}>
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={<View style={{height:0}}/>}
            />
          </View>
        )}
      </View>
    )
  }

  _renderSectionHeader(sectionItem) {
    const { section } = sectionItem
    let isFirstSection = section.key === this.state.sections[0].key &&
      section.title === this.state.sections[0].title
    return (
      <View style={[
        styles.HeadViewStyle,
        isFirstSection && {
          borderTopLeftRadius: scaleSize(36),
          borderTopRightRadius: scaleSize(36),
        },
      ]}>
        <Text style={styles.HeadTextStyle}>{section.title.toUpperCase()}</Text>
      </View>
    )
  }

  _renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._onFriendSelect(item)}
      >
        {/*<View style={styles.ITemHeadTextViewStyle}>*/}
          {/*<Text style={styles.ITemHeadTextStyle}>*/}
            {/*{item['markName'][0].toUpperCase()}*/}
          {/*</Text>*/}
        {/*</View>*/}
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item['markName']}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  HeadViewStyle: {
    height: scaleSize(72),
    backgroundColor: color.itemColorGray2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    marginLeft: scaleSize(80),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(60),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ITemHeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
  },
  
  itemImg: {
    marginLeft: scaleSize(32),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  ITemTextViewStyle: {
    paddingHorizontal: scaleSize(32),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  SectionSeparatorLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
  FlatListViewStyle: {
    position: 'absolute',
    width: scaleSize(26),
    right: scaleSize(15),
    top: scaleSize(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListItemViewStyle: {
    marginVertical: 2,
    height: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default FriendList
