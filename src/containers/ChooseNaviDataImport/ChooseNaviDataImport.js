import * as React from 'react'
import { View,Platform,StyleSheet} from 'react-native'
import { scaleSize, setSpText} from '../../utils'
import { color } from '../../styles'
import PropTypes from 'prop-types'

import MergeDatasetView from '../workspace/components/ToolBar/modules/incrementModule/customView/MergeDatasetView'

export default class ChooseNaviDataImport extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    setCurrentLayer: PropTypes.func,
    getLayers: PropTypes.func,
    device:PropTypes.object,
    currentLayer:PropTypes.object,
  }

  props: {
    navigation: Object,
    language: String,
    sourceData:Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.route
    this.state = {
      sourceData:params.sourceData,
    }
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color.background,
        }}
      >
        <MergeDatasetView sourceData={this.state.sourceData} />
      </View>
    )
  }
}