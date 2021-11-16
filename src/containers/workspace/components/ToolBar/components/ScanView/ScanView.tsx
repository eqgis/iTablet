import * as React from 'react'
import {
  View,
} from 'react-native'
import { scaleSize } from '../../../../../../utils'
import styles from './styles'

interface Props {}

interface State {}

/*
 * 扫描界面
 */
export default class ScanView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.preview}>
        {<View style={styles.overlayPreviewLeft} />}
        {<View style={styles.overlayPreviewTop} />}
        {<View style={styles.overlayPreviewRight} />}
        {<View style={styles.overlayPreviewBottom} />}
        <View
          style={{
            position: 'absolute',
            left: scaleSize(60),
            top: scaleSize(145),
          }}
        >
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            right: scaleSize(61),
            top: scaleSize(144),
            transform: [{ rotate: '90deg' }],
          }}
        >
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: scaleSize(60),
            bottom: scaleSize(600),
          }}
        >
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            right: scaleSize(61),
            bottom: scaleSize(599),
            transform: [{ rotate: '-90deg' }],
          }}
        >
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
        </View>
      </View>
    )
  }
}
