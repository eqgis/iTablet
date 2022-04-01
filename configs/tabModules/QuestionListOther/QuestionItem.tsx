import * as React from 'react'
import { ScrollView, Text, Image, View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { connect } from 'react-redux'
import { scaleSize, Toast } from '../../../src/utils'
import { getLanguage } from '../../../src/language'
import { size, color } from '../../../src/styles'
import { getPublicAssets, getThemeAssets } from '../../../src/assets'
import { Button } from '../../../src/components'
import TabContainer from '../../../src/containers/tabs/TabContainer'
import { RNFS  } from 'imobile_for_reactnative'
import { FileTools } from '../../../src/native'
import { ConstPath } from '../../../src/constants'
import { UserInfo } from '../../../src/types'
import { SurveyItemData, SurveyListData } from './QuestionInterface'
import { getTbSurveyInfoById } from '../../../src/utils/TaskThreeServiceUrtils'
import NavigationService from '../../../src/containers/NavigationService'


const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: scaleSize(162),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  item: {
    flexDirection: 'row',
    height: scaleSize(130),
    marginHorizontal: scaleSize(60),
    borderRadius: scaleSize(24),
    alignItems: 'center',
    backgroundColor: color.white,
    paddingLeft: scaleSize(38),
    paddingRight: scaleSize(16),
    // paddingVertical: scaleSize(20),
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#eee',
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },
  rightImage: {
    flexDirection: 'row',
    width: scaleSize(44),
    height: scaleSize(44),
    alignItems: 'center',
    tintColor: color.imageColorBlack,
  },
  leftImage: {
    flexDirection: 'row',
    width: scaleSize(60),
    height: scaleSize(60),
    alignItems: 'center',
    // tintColor: color.imageColorBlack,
  },
  spot: {
    position: 'absolute',
    backgroundColor: 'red',
    height: scaleSize(15),
    width: scaleSize(15),
    borderRadius: scaleSize(15),
    right: scaleSize(0),
    top: scaleSize(-5),
  },
  content: {
    marginLeft: 15,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeXl,
    color: color.fontColorBlack,
    padding: 0,
    backgroundColor: 'transparent',
  },
  subText: {
    marginTop: scaleSize(8),
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray3,
    padding: 0,
    backgroundColor: 'transparent',
  },
})

interface Props {
  navigation: Object,
  currentUser: UserInfo,
  language: string,
  data: Array<SurveyItemData>,
  id: number,
}

interface State {
  
}


class QuestionItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextState.questionData) !== JSON.stringify(this.state.questionData) ||
      JSON.stringify(nextProps.language) !== JSON.stringify(this.props.language)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props) {
  }

  _onPress = async () => {
    // 跳转到问卷详情页面
    console.warn("点击项为： " + this.props.id);

    // 第三方服务地址，暂时固定
    // let threeServiceIpUrl = 'http://192.168.11.21:6932' 
    let threeServiceIpUrl = this.props.threeServiceIpUrl
    // debugger
    let tbSurveyInfo = await getTbSurveyInfoById(this.props.id)
    // debugger
    // this.props.navigation && this.props.navigation.navigate('MyQuestionView',{tbSurveyInfo})
    NavigationService.navigate('MyQuestionView',{tbSurveyInfo})
    
  }

  render = () => {
    let data = this.props.data
    return (
      <View
        style={styles.itemContainer}
      >
        <TouchableOpacity
          style={styles.item}
          onPress={this._onPress}
        >
          {/* <Text> {"问卷列表项"}</Text> */}
          <Image
            style={styles.leftImage}
            resizeMode={'contain'}
            source = {getThemeAssets().tabBar.tab_discover}
           />
          <View
            style={styles.content}
          >
            {/* 问卷名 */}
            <Text
              numberOfLines={1}
              style={styles.text}
            >{data?.surveyname}</Text>
            {/* 创建部门 - 创建者 */}
            <Text
              numberOfLines={1}
              style={styles.subText}
            >{data?.createdepart}</Text>
            {/* 创建者 */}
            <Text
              numberOfLines={1}
              style={styles.subText}
            >{data?.creator}</Text>
          </View>
          <Image
            style={styles.rightImage}
            resizeMode={'contain'}
            source={getThemeAssets().publicAssets.icon_jump}
          />
        </TouchableOpacity>
        
      </View>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: any) => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentUser: state.user.toJS().currentUser,
  threeServiceIpUrl: state.cowork.toJS().threeServiceIpUrl,
})

// 链接Redux，获取持久化/全局动态数据
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionItem)
