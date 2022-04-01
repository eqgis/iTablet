import * as React from 'react'
import { ScrollView, Text, Image, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { scaleSize, Toast } from '../../src/utils'
import { getLanguage } from '../../src/language'
import { size, color } from '../../src/styles'
import { getPublicAssets, getThemeAssets } from '../../src/assets'
import TabContainer from '../../src/containers/tabs/TabContainer'
import { UserInfo } from '../../src/types'
import { login, getTbSurveyList } from '../../src/utils/TaskThreeServiceUrtils'
import QuestionItem from './QuestionListOther/QuestionItem'
import { SurveyItemData, addTbAnswerList } from './QuestionListOther/QuestionInterface'


const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: scaleSize(30),
  },
})



interface Props {
  navigation: Object,
  currentUser: UserInfo,
  language: string,
}

interface State {
  surveyList: Array<SurveyItemData>,
}


class QuestionListView extends React.Component<Props, State> {
  // TbSurveyList: SurveyListData
  tbSurveyList: any

  constructor(props: Props) {
    super(props)
    this.state = {
      surveyList:[],
    }
  }

  static getTitle = (language?: string): string => {
    return language !== 'CN' ? 'Question List' : '问卷列表'
  }

  componentDidMount = async () => {
    await this.getData()
  }

  /** 获取问卷数据 */
  getData = async () => {
    // 第三方服务地址，暂时固定
    let threeServiceIpUrl = 'http://192.168.11.21:6932' 
    // 登录重置token的值
    // debugger
    await login(threeServiceIpUrl)
    // 获取问卷列表
    this.tbSurveyList = await getTbSurveyList(threeServiceIpUrl, 1, 10)
    // debugger
    this.setState({
      surveyList: this.tbSurveyList.records
    })
  }

  shouldComponentUpdate = (nextProps: Props, nextState: State) => {
    if (
      JSON.stringify(nextState.surveyList) !== JSON.stringify(this.state.surveyList) ||
      JSON.stringify(nextProps.language) !== JSON.stringify(this.props.language)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate = (prevProps: Props) => {
  }
  
  _renderItem = ({item, index}) => {
    return (
      <QuestionItem
        data = {item}
        id = {item.id}
      />
    )
  }

  render = () => {
    return (
      <TabContainer
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
        title: QuestionListView.getTitle(this.props.language),
        withoutBack: true,
        }}
        navigation={this.props.navigation}
      >
       {/* {
          this.state.surveyList && (
          <QuestionItem
              data = {this.state.surveyList[0]}
          />
          )
       } */}
       {/* <Text> {"问卷列表页面"}</Text> */}
       {/* 用FlatList组件来写列表 */}
       <FlatList
         style = {{
            width: '100%',
            height: '100%',
         }}
         data={this.state.surveyList}
         renderItem = {this._renderItem}
         keyExtractor = {item => item.id}
       />
      </TabContainer>
     
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: any) => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentUser: state.user.toJS().currentUser,
})

// 链接Redux，获取持久化/全局动态数据
const MyQuestionListView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionListView)

// 导出界面相关信息
export default {
  key: 'QuestionList',
  // 根据系统语言获取Title
  getTitle: QuestionListView.getTitle,
  // 自定义Tab界面
  Screen: MyQuestionListView,
  // Tab未点击图片
  image: getThemeAssets().tabBar.tab_discover,
  selectedImage: getThemeAssets().tabBar.tab_discover_selected,
}

