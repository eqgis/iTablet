import * as React from 'react'
import { ScrollView, Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { scaleSize, Toast } from '../../../src/utils'
import { getLanguage } from '../../../src/language'
import { size, color } from '../../../src/styles'
import { getPublicAssets, getThemeAssets } from '../../../src/assets'
import { Button, Container } from '../../../src/components'
import survey from '../../../src/assets/survey.json'
import TabContainer from '../../../src/containers/tabs/TabContainer'
import { RNFS  } from 'imobile_for_reactnative'
import { FileTools } from '../../../src/native'
import { ConstPath } from '../../../src/constants'
import { UserInfo } from '../../../src/types'
import { addTbAnswerList } from '../../../src/utils/TaskThreeServiceUrtils'
import { AnswerData } from './QuestionInterface'

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: scaleSize(30),
  },
  formHeader: {
    // height: scaleSize(80),
    width: '100%',
    flexDirection: 'column',
    paddingVertical: scaleSize(30),
  },
  formHeaderTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.itemColorBlack,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formHeaderSubTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.itemColorBlack,
  },
  formQuestion: {
    flexDirection: 'column',
  },
  formQuestionHeader: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  formQuestionHeaderTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.itemColorBlack,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formQuestionOptions: {
    flexDirection: 'column',
  },
  formQuestionOption: {
    marginLeft: scaleSize(36),
    height: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectImage: {
    height: 30,
    width: 30,
  },
  formQuestionOptionTitle: {
    marginLeft: scaleSize(8),
    fontSize: size.fontSize.fontSizeMd,
    color: color.itemColorBlack,
  },
  formSubmit: {
    width: scaleSize(200),
    borderRadius: scaleSize(4),
    marginVertical: scaleSize(30),
    alignSelf: 'center',
  },
})

interface Props {
  navigation: Object,
  currentUser: UserInfo,
  language: string,
}

interface State {
  questionData: any,
}

class QuestionView extends React.Component<Props, State> {
  form: typeof Form | undefined | null
  constructor(props: Props) {
    super(props)
    // this.questionData = survey

    let surveyInfo = this.props.navigation.state.params.tbSurveyInfo
    this.state = {
      questionData: surveyInfo,
    }
  }

  static getTitle = (language?: string): string => {
    return language !== 'CN' ? 'Question' : '问卷'
  }

  async componentDidMount() {
    const homePath = await FileTools.getHomeDirectory()
    const tempPath = homePath +
      ConstPath.UserPath +
      this.props.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp

    let files = await FileTools.getPathListByFilter(tempPath, {
      extension: 'ques',
    })
    if (files.length > 0) {
      let content = await RNFS.readFile(homePath + files[0].path)
      let contentObj = JSON.parse(content)
      let questionResult = contentObj[Object.keys(contentObj)[0]]
      const map = new Map(Object.entries(questionResult))
      this.form?.setSelectedData(map)
    }
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

  render = () => {

    return (
      <Container
        ref={(ref: any) => (this.container = ref)}
        headerProps={{
          title: QuestionView.getTitle(this.props.language),
          withoutBack: true,
        }}
        navigation={this.props.navigation}
      >
        <Form
          ref={ref => {
            if (ref) {
              this.form = ref
            }
          }}
          data={this.state.questionData}
          language={this.props.language}
          submit={async (data: Map<string, number[]>) => {
            // 检查必须完成的选项
            let requireIds: number[] = []
            this.state.questionData.quesAndOpts.forEach((element: any) => {
              // 要将未渲染的空数据给过滤掉
              if(element.tbQuestion.quesname !== "" && element.tbQuestionOpts.length !== 0) {
                element.tbQuestion.isrequired === 2 && requireIds.push(element.tbQuestion.id)
              }
            })

            for (const questionId of requireIds) {
              if (!data.has(questionId + '')) {
                Toast.show('请完成必选选项')
                return
              }
            }

            // 提交处理数据
            const resultStr = {
              [this.state.questionData.tbSurvey.id]: [...data.entries()].reduce((obj, [key, value]) => (obj[key] = value, obj), {}),
            }
           
            try {
              let answerInfoList = resultStr[this.state.questionData.tbSurvey.id]
  
              let aswerList:Array<AnswerData> = []
              let len = answerInfoList.length
              let time = new Date();
  
              let tbSurvey = this.state.questionData.tbSurvey
              let quesAndOpts = this.state.questionData.quesAndOpts
              let index = 0;
              for (const key in answerInfoList) {
  
                // 确定问题类型，要去遍历
  
                let obj =  {
                  createtime: "" + time,
                  depart: tbSurvey.createdepart,
                  id: index,
                  optid: answerInfoList[key][0],
                  questionid: parseInt(key),
                  questype: 1,
                  surveyid: tbSurvey.id,
                  voter: "string"
                }
                // 索引ID自加
                index ++
                // 将数据放进数组里
                aswerList.push(obj)
              }
  
              // 第三方服务地址，暂时固定
              let threeServiceIpUrl = 'http://192.168.11.21:6932' 
              debugger
              await addTbAnswerList(threeServiceIpUrl, aswerList)
            } catch (error) {
              debugger
            }

            // const tempPath = (await FileTools.getHomeDirectory()) +
            //   ConstPath.UserPath +
            //   this.props.currentUser.userName +
            //   '/' +
            //   ConstPath.RelativePath.Temp

            // RNFS.writeFile(`${tempPath}/question_${new Date().getTime()}.ques`, JSON.stringify(resultStr), 'utf8')

            Toast.show(getLanguage(this.props.language).Profile.SUGGESTION_SUBMIT_SUCCEED)
          }}
        />
      </Container>
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
const MyQuestionView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionView)

export default MyQuestionView

// 导出界面相关信息
// export default {
//   key: 'Question',
//   // 根据系统语言获取Title
//   getTitle: QuestionView.getTitle,
//   // 自定义Tab界面
//   Screen: MyQuestionView,
//   // Tab未点击图片
//   image: getThemeAssets().tabBar.tab_discover,
//   selectedImage: getThemeAssets().tabBar.tab_discover_selected,
// }

interface FormProps {
  data: any,
  language: string,
  submit: (data: Map<string, number[]>) => void,
}

interface FormState {
  data: any,
  selectedData: Map<string, number[]>,
}

class Form extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      data: JSON.parse(JSON.stringify(this.props.data)),
      selectedData: new Map<string, number[]>(),
    }
  }

  setSelectedData = (map: Map<string, number[]>) => {
    this.setState({
      selectedData: map,
    })
  }

  renderQuestion = (element: any, index: number) => {
    return (
      <View style={styles.formQuestion}>
        <View style={styles.formQuestionHeader}>
          <Text style={styles.formQuestionHeaderTitle}>
            <Text style={{color: 'red'}}>{element.tbQuestion.isrequired ? '*' : ' '}</Text>
            {(++index) + '. ' + element.tbQuestion.quesname}
          </Text>
        </View>
        <View style={styles.formQuestionOptions}>
          {
            element?.tbQuestionOpts.map((option: any) => {
              return this.renderQuestionOptions(option)
            })
          }
        </View>
      </View>
    )
  }

  renderQuestionOptions = (option: any) => {
    const ids = this.state.selectedData.get(option.questionid + '') || []
    let icon = ids.indexOf(option.id) >= 0
      ? getPublicAssets().common.icon_radio_selected
      : getPublicAssets().common.icon_radio_unselected
    return (
      <TouchableOpacity
        style={styles.formQuestionOption}
        onPress={() => {
          const _selectedData = new Map().clone(this.state.selectedData)
          if (this.state.selectedData.has(option.questionid + '')) {
            let ids = this.state.selectedData.get(option.questionid + '') || []
            const idIndex = ids.indexOf(option.id)
            if (ids.length > 0 && idIndex >= 0) {
              ids.splice(idIndex, 1)
              ids.length === 0 && _selectedData.delete(option.questionid)
            } else {
              // TODO 多选
              if (ids.length > 0) { // 单选
                ids = []
              }
              ids.push(option.id)
              _selectedData.set(option.questionid + '', ids)
            }
            this.setState({
              selectedData: _selectedData,
            })
          } else {
            _selectedData.set(option.questionid + '', [option.id])
            this.setState({
              selectedData: _selectedData,
            })
          }
        }}
      >
        <Image
          style={styles.selectImage}
          source={icon}
        />
        <Text style={styles.formQuestionOptionTitle}>{option.opt}</Text>
      </TouchableOpacity>
    )
  }

  _onPress = () => {
    this.props.submit?.(this.state.selectedData)
  }

  render = () => {
    const questionHeader = this.state.data.tbSurvey
    const question= this.state.data.quesAndOpts
    return (
      <ScrollView
        style={styles.scrollView}
      >
        <View style={styles.formHeader}>
          <Text style={styles.formHeaderTitle}>{questionHeader.surveyname}</Text>
          {/* <Text style={styles.formHeaderSubTitle}>{questionHeader.createdepart}</Text> */}
        </View>
        {
          question?.map((element: any, index: number) => {
            if(element.tbQuestion.quesname !== "" && element.tbQuestionOpts.length !== 0) {
              return (
                this.renderQuestion(element, index)
              )
            }
          })
        }
        <Button
          style={styles.formSubmit}
          title={getLanguage(this.props.language).Prompt.SUBMIT}
          onPress={this._onPress}
        />
      </ScrollView>
    )
  }
}
