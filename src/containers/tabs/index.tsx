import React from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home, { Setting, AboutITablet } from './Home'
import Mine, {
  MyService,
  MyLocalData,
  MyMap,
  MyARMap,
  MyARModel,
  MyAREffect,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  Login,
  MyLabel,
  MyBaseMap,
  MyDataset,
  NewDataset,
  SearchMine,
  MyApplet,
  MyAIModel,
  MySandTable,
} from './Mine'
import Find from './Find'
import FindSettingPage from './Find/FindSettingPage'
import SuperMapKnown from './Find/superMapKnown'
import PublicData from './Find/PublicData'
import Applet from './Find/Applet'
import Laboratory from './Find/Laboratory'
import CoworkManagePage from './Find/CoworkManagePage'
import Friend, {
  Chat,
  AddFriend,
  InformMessage,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  SelectFriend,
} from './Friend'
import { AppTabs } from '../../constants'

const Tab = createBottomTabNavigator()

function Tabs(arr: any[]) {
  const tabs = [
    <Tab.Screen name='Home' component={Home} />
  ]
  for (let i = 0; i < arr?.length; i++) {
    switch (arr[i]) {
      case AppTabs.Friend:
        tabs.push(<Tab.Screen name='Friend' component={Friend} options={{lazy: false}} />)
        break
      case AppTabs.Find:
        tabs.push(<Tab.Screen name='Find' component={Find} />)
        break
      case AppTabs.Mine:
        tabs.push(<Tab.Screen name='Mine' component={Mine} />)
        break
      default:
        if (arr[i] && arr[i].Screen) {
          tabs.push(<Tab.Screen name={arr[i].key} component={arr[i].Screen} />)
        }
    }
  }
  return (
    <Tab.Navigator
      screenOptions={{
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }}
      tabBar={() => <View style={{height: 0, width: '100%'}} />}
    >
      {tabs}
    </Tab.Navigator>
  )
}

export {
  Tabs,
  /** Mine */
  MyService,
  MyLocalData,
  MyMap,
  MyARMap,
  MyARModel,
  MyAREffect,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  MyDataset,
  NewDataset,
  SearchMine,
  MyApplet,
  MyAIModel,
  MySandTable,
  /** Home */
  Home,
  Setting,
  AboutITablet,
  Login,
  Find,
  /** friend */
  Friend,
  Chat,
  InformMessage,
  AddFriend,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  SelectFriend,
  //-----------
  MyLabel,
  MyBaseMap,
  SuperMapKnown,
  PublicData,
  Applet,
  CoworkManagePage,
  FindSettingPage,
  Laboratory,
}
