import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Platform } from 'react-native'
import * as ImagePicker from './src'
import PageKeys from './src/PageKeys'
const Stack = createNativeStackNavigator()

export default ImagePicker

export function ImagePickerStack() {
  return (
    <Stack.Navigator
      initialRouteName={PageKeys.album_list}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        presentation: 'transparentModal',
      }}
    >
      <Stack.Screen name={PageKeys.album_list} component={ImagePicker.AlbumListView} />
      <Stack.Screen name={PageKeys.album_view} component={ImagePicker.AlbumView} />
    </Stack.Navigator>
  )
}
