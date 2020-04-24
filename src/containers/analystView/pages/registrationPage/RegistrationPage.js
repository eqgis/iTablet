import React, { Component } from 'react'
import { Container, TextBtn } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

// import { SMRectifyView, SRectifyView } from 'imobile_for_reactnative'
import { SMRectifyView } from 'imobile_for_reactnative'

export default class RegistrationPage extends Component {
  constructor(props) {
    super(props)

    let tempData = this.getData()

    this.state = {
      data: tempData,
      isCanDo: false,
    }
  }

  componentDidMount = async () => {
    // if(GLOBAL.RectifyDatasetInfo){
    //   await SRectifyView.setRectifyDataset(GLOBAL.RectifyDatasetInfo)
    // }
    // if(GLOBAL.RectifyReferDatasetInfo){
    //   await SRectifyView.setReferDataset(GLOBAL.RectifyReferDatasetInfo)
    // }
  }

  getData() {
    let data = []
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_LINE,
      arithmeticMode: 1,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_QUADRATIC,
      arithmeticMode: 2,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_RECTANGLE,
      arithmeticMode: 3,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_OFFSET,
      arithmeticMode: 4,
    })

    return data
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels.REGISTRATION,
          headerRight: (
            <TextBtn
              // btnText={this.state.btnTitle}
              // btnText={"this.state.btnTitle"}
              textStyle={
                this.state.isCanDo
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <SMRectifyView
          ref={ref => (GLOBAL.SMAIDetectView = ref)}
          style={{
            flex: 1,
            paddingHorizontal: scaleSize(30),
            alignItems: 'center',
            backgroundColor: color.bgW,
          }}
          language={global.language}
        />
      </Container>
    )
  }
}
