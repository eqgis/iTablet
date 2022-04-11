import * as React from 'react'
import { ScrollView, Text, Image, View, StyleSheet, TouchableOpacity, FlatList , RefreshControl} from 'react-native'
import { connect } from 'react-redux'
import { scaleSize, Toast } from '../../src/utils'
import { getLanguage } from '../../src/language'
import { size, color } from '../../src/styles'
import { getPublicAssets, getThemeAssets } from '../../src/assets'
import TabContainer from '../../src/containers/tabs/TabContainer'
import { UserInfo } from '../../src/types'
import { login, getTbSurveyList } from '../../src/utils/TaskThreeServiceUrtils'
import QuestionItem from './QuestionListOther/QuestionItem'
import { SurveyItemData } from './QuestionListOther/QuestionInterface'
import CoworkFileHandle from '../../src/containers/tabs/Find/CoworkManagePage/CoworkFileHandle'
import { setThreeServiceIpUrl } from '../../src/redux/models/cowork'


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
  isRefresh: boolean,
}


class QuestionListView extends React.Component<Props, State> {
  // TbSurveyList: SurveyListData
  tbSurveyList: any

  constructor(props: Props) {
    super(props)
    this.state = {
      surveyList:[],
      isRefresh: false,
    }
  }

  static getTitle = (language?: string): string => {
    return language !== 'CN' ? 'Question List' : '问卷列表'
  }

  componentDidMount = async () => {
   if(!this.props.currentUser){
     Toast.show("请先登录")
   }
    await this.getData()
  }

  /** 获取问卷数据 */
  getData = async () => {
    // 第三方服务地址，暂时固定
    // let threeServiceIpUrl = this.props.threeServiceIpUrl
    // // 登录重置token的值
    // await login(threeServiceIpUrl)

    if(this.props.threeServiceIpUrl === '') {
      // 初始化
      await CoworkFileHandle.init(this.props.currentUser)
      // 先同步本地文件与online文件
      await CoworkFileHandle.syncOnlineCoworkList()
     
    }

    // 再获取本地文件数据
    let cowork = await CoworkFileHandle.getLocalCoworkList()
    if(cowork){
      await this.props.setThreeServiceIpUrl({threeServiceIpUrl:cowork?.url})
     
    }

    console.warn(this.props.threeServiceIpUrl);
    let tempUrl = this.props.threeServiceIpUrl
    if(tempUrl === '') {
      // 延迟30秒
      await setTimeout(() => {
        
      }, 30000);
      // 停止更新状态转圈
      this.setState({
        isRefresh: false,
      })
      Toast.show("无效的ip地址：" + tempUrl)
    } else {
      await login(this.props.threeServiceIpUrl)

      // 获取问卷列表
      this.tbSurveyList = await getTbSurveyList(1, 10)
      if(this.tbSurveyList) {
        this.setState({
          surveyList: this.tbSurveyList.records,
          isRefresh: false,
        })
        Toast.show("问卷列表获取成功！")
      } else {
         // 停止更新状态转圈
        this.setState({
          isRefresh: false,
        })
        Toast.show("问卷列表获取失败！")
      }
    }
    
    
   
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
  download = async () => {
    await this.getData()
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
       />
      </TabContainer>
     
    )
  }
}

const mapDispatchToProps = {
  setThreeServiceIpUrl,
}

const mapStateToProps = (state: any) => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentUser: state.user.toJS().currentUser,
  threeServiceIpUrl: state.cowork.toJS().threeServiceIpUrl,
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

