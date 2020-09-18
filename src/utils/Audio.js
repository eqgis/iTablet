import React from 'react'
import { TouchableOpacity } from 'react-native'
import RootSiblings from 'react-native-root-siblings'
import AudioDialog from '../components/AudioTools/AudioDialog'
import { getLanguage } from '../language/index'

let sibling, AudioDialogRef
function showAudio(type = 'top', audioProps = {}) {
  sibling = new RootSiblings()
  sibling.update(
    <TouchableOpacity
      activeOpacity={1}
      style={{
        position: 'absolute',
        backgroundColor: 'transparent',
        // zIndex: 1000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onPress={hideAudio}
    >
      <AudioDialog
        ref={ref => (AudioDialogRef = ref)}
        type={type}
        defaultText={getLanguage(global.language).Prompt.SPEECH_TIP}
        // device={this.props.device}
        language={global.language}
        close={hideAudio}
        {...audioProps}
      />
    </TouchableOpacity>
  )
}

async function hideAudio () {
  if (AudioDialogRef) {
    await AudioDialogRef.stopRecording()
  }
  sibling && sibling.destroy()
  sibling = null
}

function isShow () {
  return !!AudioDialogRef
}

export default {
  showAudio,
  hideAudio,
  isShow,
}