import React from 'react'
import { FlatList, Text, View, Image, Switch, TouchableOpacity, Platform } from 'react-native'
import { Container, Dialog } from '../../../../components'
import { scaleSize, dataUtil } from '../../../../utils'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { connect } from 'react-redux'
import { toggleLaboratoryItem } from '../../../../redux/models/setting'
import styles from './styles'

class Laboratory extends React.Component {
  props: {
    navigation: Object,
    laboratory: Object,
    language: String,
    toggleLaboratoryItem: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.getData(),
      info: '',
      currentData: {},
    }
  }

  getData = () => {
    return Platform.select({
      ios: [
        {
          key: getLanguage(this.props.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
          value: 'highPrecisionCollect',
          image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
          info: getLanguage(this.props.language).Find.LAB_FORM_COLLECT_INFO,
        },
      ],
      android: [
        {
          key: getLanguage(this.props.language).Map_Main_Menu.MAP_AI_GESTURE_BONE,
          value: 'gestureBone',
          image: require('../../../../assets/mapTools/icon_select_by_rectangle.png'),
          info: getLanguage(this.props.language).Find.LAB_GESTURE_BONE_INFO,
        },
        {
          key: getLanguage(this.props.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION,
          value: 'poseEstimation',
          image: getThemeAssets().ar.functiontoolbar.ar_bodyposture,
          info: getLanguage(this.props.language).Find.LAB_GESTURE_BONE_INFO,
        },
        {
          key: getLanguage(this.props.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
          value: 'highPrecisionCollect',
          image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
          info: getLanguage(this.props.language).Find.LAB_FORM_COLLECT_INFO,
        },
      ],
    })
  }

  renderItem = ({ index, item }) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: scaleSize(10),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleSize(80),
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
            
            }}
          >
            <Image
              source={item.image}
              style={{
                width: scaleSize(50),
                height: scaleSize(50),
                marginHorizontal: scaleSize(10),
              }}
            />
            <Text style={{ fontSize: scaleSize(26) }}>{item.key}</Text>
          </TouchableOpacity>
          <Switch
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={this.props.laboratory[item.value] ? color.bgW : color.bgW}
            ios_backgroundColor={
              this.props.laboratory[item.value] ? color.switch : color.bgG
            }
            value={this.props.laboratory[item.value]}
            onValueChange={value => {
              let data = Object.assign({}, this.props.laboratory)
              data[item.value] = value
              if (data[item.value]) {
                this.data = data
                this.Dialog && this.setState({
                  // info: item.info || '',
                  currentData: dataUtil.deepClone(item),
                }, () => {
                  this.Dialog.setDialogVisible(true)
                })
              } else {
                this.data = null
                this.props.toggleLaboratoryItem(data)
              }
            }}
          />
        </View>
        {this.state.data.length !== index + 1 && (
          <View
            style={{
              height: scaleSize(1),
              backgroundColor: color.itemColorGray2,
            }}
          />
        )}
      </View>
    )
  }
  
  _renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.Dialog = ref)}
        // type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        confirmAction={() => {
          if (this.data) {
            this.props.toggleLaboratoryItem(this.data)
          }
          this.data = null
          this.Dialog && this.Dialog.setDialogVisible(false)
        }}
        cancelAction={() => {
          this.data = null
          this.Dialog && this.Dialog.setDialogVisible(false)
        }}
        opacity={1}
        style={styles.dialogView}
        disableBackTouch={false}
        onlyOneBtn={true}
        cancelBtnVisible={false}
        infoStyle={{ textAlign: 'left' }}
      >
        <View style={styles.promptView}>
          <Image
            source={this.state.currentData.image}
            style={styles.dialogHeaderImg}
          />
          <Text style={styles.promptTitle}>
            {this.state.currentData.key}
          </Text>
          <Text style={styles.promptContent}>
            {this.state.currentData.info}
          </Text>
          <Text style={styles.promptTips}>
            {getLanguage(this.props.language).Find.BETA_TIPS}
          </Text>
        </View>
      </Dialog>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Find.LABORATORY,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.props.laboratory}
        />
        {this._renderDialog()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  laboratory: state.setting.toJS().laboratory,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  toggleLaboratoryItem,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Laboratory)
