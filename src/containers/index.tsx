import React from 'react'
import {
  createNativeStackNavigator,
  ScreenOptions,
} from '@react-navigation/native-stack'

// 主页

// 我的
import {
  Tabs,
  MyService,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
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
  MyApplet,
  MyAIModel,
  MySandTable,
  Personal,
  ToggleAccount,
  Setting,
  AboutITablet,
  Login,
  MyDataset,
  NewDataset,
  SearchMine,
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
  MyLabel,
  MyBaseMap,
  SuperMapKnown,
  PublicData,
  Applet,
  CoworkManagePage,
  FindSettingPage,
  Laboratory,
} from './tabs'

import GetBack from './register&getBack/GetBack'
// 地图二级设置菜单
import SecondMapSettings from './mapSetting/secondMapSettings'
// 地图功能页面
import MTLayerManager from './mtLayerManager'
import Layer3DManager from './Layer3DManager'
import MapSetting from './mapSetting'
import Map3DSetting from './setting'
import {
  LayerSelectionAttribute,
  LayerAttributeAdd,
  LayerAttributeSearch,
  LayerAttributeStatistic,
  LayerAttribute,
} from './layerAttribute'
// import dataSourcelist from './dataSourcelist'
import ColorPickerPage from './colorPickerPage'
import {
  MapStack,
  Map3DStack,
  // MapAnalystTabs,
  CoworkTabs,
  MapView,
} from './workspace'
import MapToolbarSetting from './workspace/components/MapToolbarSetting'
import TouchProgress from './workspace/components/TouchProgress'
import AnimationNodeEditView from './workspace/components/AnimationNodeEditView'
import AnimationNodeEditRotateView from './workspace/components/AnimationNodeEditRotateView'
import AddOnlineScense from './workspace/components/AddOnlineScense'
import InputPage from './InputPage'
import InputStyledText from './InputStyledText'
import Protocol from './tabs/Home/AboutITablet/Protocol'
import {
  LicensePage,
  LicenseTypePage,
  LicenseModule,
  LicenseJoin,
  LicenseJoinCloud,
  LoginCloud,
  LicenseJoinPrivateCloud,
  ConnectServer,
  LicenseJoinEducation,
} from './tabs/Home/License'
import SuggestionFeedback from './tabs/Home/SuggestionFeedback/SuggestionFeedback'
import PointAnalyst from './pointAnalyst'
import PublicMap from './publicMap'
import FriendMap from './friendMap'
import LoadServer from './tabs/Mine/MyBaseMap/LoadServer'
import { MapCut, MapCutDS } from './mapCut/page'
import {
  BufferAnalystView,
  AnalystRadiusSetting,
  AnalystListEntry,
  OverlayAnalystView,
  OnlineAnalystView,
  IServerLoginPage,
  SourceDatasetPage,
  AnalystRangePage,
  WeightAndStatistic,
  LocalAnalystView,
  RegistrationDatasetPage,
  RegistrationReferDatasetPage,
  RegistrationArithmeticPage,
  RegistrationExecutePage,
  ProjectionTransformationPage,
  SourceCoordsPage,
  ProjectionParameterSetPage,
  ProjectionTargetCoordsPage,
  RegistrationFastPage,
  RegistrationPage,
  ReferenceAnalystView,
  InterpolationAnalystView,
  InterpolationAnalystDetailView,
} from './analystView/pages'

import MediaEdit from './mediaEdit'
import Camera from './camera'
import ClassifyView from './aiClassifyView'
import ModelChoseView from './arModelChoseView'
import ClassifyResultEditView from './aiClassifyResultEdit'
import EnterDatumPoint from './arEnterDatumPoint/EnterDatumPoint'
import CollectSceneFormSet from './arEnterDatumPoint/CollectSceneFormSet'
import ClassifySettingsView from './ClassifySettingsView'
import IllegallyParkView from './aiIllegallyPark'
import AISelectModelView from './aiSelectModelView'
import AIDetectSettingView from './aiDetectSettingView'
import ARNavigationView from './arNavigationView'
import ChooseWeather from './chooseWeather'
import AIPoseEstimationView from './aiPoseEstimationView'
import AIGestureBoneView from './aiGestureBoneView'
import ChooseLayer from './chooseLayer'

import NavigationView from './workspace/components/NavigationView'
import NavigationDataChangePage from './NavigationDataChangePage'
import CreateNavDataPage from './CreateNavDataPage'
import ChooseTaggingLayer from './ChooseTaggingLayer'
import ChooseNaviLayer from './ChooseNaviLayer'
import ChooseNaviDataImport from './ChooseNaviDataImport'
import LanguageSetting from './languageSetting'
import CollectSceneFormHistoryView from './arCollectSceneFormHistoryView'
import LocationSetting from './locationSetting'
import CustomModePage from './CustomModePage'
import CoworkMessage from './tabs/Friend/Cowork/CoworkMessage'
import {
  CreateGroupPage,
  GroupSelectPage,
  GroupFriendListPage,
  GroupApplyPage,
  GroupInvitePage,
  GroupSourceManagePage,
  GroupSourceUploadPage,
  GroupMessagePage,
  SelectModulePage,
  GroupSettingPage,
  CoworkMember,
} from './tabs/Find/CoworkManagePage/pages'
import {
  TemplateManager,
  TemplateDetail,
  TemplateSource,
} from './templateManager/pages'
import AppletManagement from './applet/appletManagement'
import AppletList from './applet/appletList'
import SampleMap from './sampleMap'
import SelectLocation from './workspace/pages/SelectLocation'
import ARLayerManager from './arLayerManager'
import ARMapSetting from './arMapSettings/ARMapSetting'
import ServiceShareSettings from './serviceShareSettings'
import NavigationView2D from './workspace/components/ArNavigation/NavigationView2D'
import RoadNet from './workspace/components/ArNavigation/RoadNet'
import Report from '../containers/tabs/Friend/Chat/Report'
import WebView from '../components/WebView'
import { ImagePickerStack } from '@/components/ImagePicker'
import { UserInfo } from '@/types'
import { Platform } from 'react-native'
import MapSelectList from '../containers/workspace/components/ToolBar/modules/arDrawingModule/MapSelectList'
import { DEVICE } from '@/redux/models/device'
import ChartManager from './ChartManager/ChartManager'
import * as ImagePicker from '@/components/ImagePicker/src'
import ExternalDevices from './ExternalDevices'
import BluetoothDevices from './BluetoothDevices'
import NtripSetting from './NtripSetting'
import ARAnimation from './ARAnimation/ARAnimation'
import AttributeDetail from './AttributeDetail'

const Stack = createNativeStackNavigator()

interface StackNavigatorProps {
  appConfig: any,
  device: DEVICE,
  currentUser: UserInfo,
}

/**
 * 不隐藏上一节面
 * ios使用transparentModal时,在该页面跳转的页面也需要使用transparentModal,否则跳转的页面会出现在下一层
 */
const modalOption = (params: StackNavigatorProps): ScreenOptions => {
  return {
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
    // presentation: Platform.OS === 'ios' ? 'formSheet' : 'containedTransparentModal',
    // presentation: Platform.OS === 'ios' && params.device.orientation.indexOf('PORTRAIT') >= 0 ? 'card' : 'containedTransparentModal',
  }
}
const modalOption2 = (params: StackNavigatorProps): ScreenOptions => {
  return {
    headerShown: false,
    animation: 'none',
    // presentation: 'containedTransparentModal',
    // presentation: Platform.OS === 'ios' ? 'formSheet' : 'containedTransparentModal',
    // presentation: Platform.OS === 'ios' && params.device.orientation.indexOf('PORTRAIT') >= 0 ? 'card' : 'containedTransparentModal',
  }
}

export default function(params: StackNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName='Tabs'
      screenOptions={{
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        // presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
        presentation: 'card',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Tabs">
        {() => Tabs(params.appConfig.tabModules)}
      </Stack.Screen>
      <Stack.Screen name="CreateGroupPage" component={CreateGroupPage} options={modalOption(params)} />
      <Stack.Screen name="MapStack" >
        {() => MapStack(params.device)}
      </Stack.Screen>
      <Stack.Screen name="Map3DStack" >
        {() => Map3DStack(params.device)}
      </Stack.Screen>
      <Stack.Screen name="CoworkTabs" options={modalOption(params)} >
        {() => CoworkTabs(params.device)}
      </Stack.Screen>
      <Stack.Screen name="MapViewSingle" component={MapView} />
      <Stack.Screen name="MapSetting" component={MapSetting} options={modalOption(params)}/>
      <Stack.Screen name="Map3DSetting" component={Map3DSetting} options={modalOption(params)}/>
      <Stack.Screen name="CoworkMember" component={CoworkMember} options={modalOption(params)} />
      <Stack.Screen name="CoworkMessage" component={CoworkMessage} options={modalOption(params)} />
      <Stack.Screen name="GroupSelectPage" component={GroupSelectPage} options={modalOption2(params)} />
      <Stack.Screen name="GroupFriendListPage" component={GroupFriendListPage} options={modalOption(params)} />
      <Stack.Screen name="GroupApplyPage" component={GroupApplyPage} options={modalOption(params)} />
      <Stack.Screen name="GroupInvitePage" component={GroupInvitePage} options={modalOption(params)} />
      <Stack.Screen name="GroupSourceManagePage" component={GroupSourceManagePage} options={modalOption(params)} />
      <Stack.Screen name="GroupSourceUploadPage" component={GroupSourceUploadPage} options={modalOption(params)} />
      <Stack.Screen name="GroupMessagePage" component={GroupMessagePage} options={modalOption(params)} />
      <Stack.Screen name="SelectModulePage" component={SelectModulePage} options={modalOption(params)} />
      <Stack.Screen name="GroupSettingPage" component={GroupSettingPage} options={modalOption(params)} />
      <Stack.Screen name="LayerManager" component={MTLayerManager} options={modalOption(params)}/>
      <Stack.Screen name="Layer3DManager" component={Layer3DManager} options={modalOption(params)}/>
      <Stack.Screen name="LayerSelectionAttribute" component={LayerSelectionAttribute} options={modalOption(params)} />
      <Stack.Screen name="LayerAttribute" component={LayerAttribute} options={modalOption(params)} />
      <Stack.Screen name="LayerAttribute3D" component={LayerAttribute} options={modalOption(params)} />
      <Stack.Screen name="LayerAttributeAdd" component={LayerAttributeAdd} options={modalOption(params)} />
      <Stack.Screen name="LayerAttributeSearch" component={LayerAttributeSearch} options={modalOption(params)} />
      <Stack.Screen name="LayerAttributeStatistic" component={LayerAttributeStatistic} options={modalOption(params)} />
      <Stack.Screen name="ChooseLayer" component={ChooseLayer} options={modalOption(params)} />
      <Stack.Screen name="ColorPickerPage" component={ColorPickerPage} options={modalOption(params)} />
      <Stack.Screen name="MapCut" component={MapCut} options={modalOption(params)} />
      <Stack.Screen name="MapCutDS" component={MapCutDS} options={modalOption(params)} />
      <Stack.Screen name="MapToolbarSetting" component={MapToolbarSetting} options={modalOption(params)} />
      <Stack.Screen name="TouchProgress" component={TouchProgress} options={modalOption(params)} />
      <Stack.Screen name="InputPage" component={InputPage} options={modalOption(params)} />
      <Stack.Screen name="InputStyledText" component={InputStyledText} options={modalOption(params)} />
      <Stack.Screen name="AnimationNodeEditView" component={AnimationNodeEditView} options={modalOption(params)} />
      <Stack.Screen name="AnimationNodeEditRotateView" component={AnimationNodeEditRotateView} options={modalOption(params)} />
      <Stack.Screen name="AddOnlineScense" component={AddOnlineScense} options={modalOption(params)} />
      <Stack.Screen name="TemplateManager" component={TemplateManager} options={modalOption(params)} />
      <Stack.Screen name="TemplateDetail" component={TemplateDetail} options={modalOption(params)} />
      <Stack.Screen name="TemplateSource" component={TemplateSource} options={modalOption(params)} />
      <Stack.Screen name="Chat" component={Chat} options={modalOption(params)} />
      <Stack.Screen name="AddFriend" component={AddFriend} options={modalOption(params)} />
      <Stack.Screen name="InformMessage" component={InformMessage} options={modalOption(params)} />
      <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} options={modalOption(params)} />
      <Stack.Screen name="RecommendFriend" component={RecommendFriend} options={modalOption(params)} />
      <Stack.Screen name="ManageFriend" component={ManageFriend} options={modalOption(params)} />
      <Stack.Screen name="ManageGroup" component={ManageGroup} options={modalOption(params)} />
      <Stack.Screen name="SelectModule" component={SelectModule} options={modalOption(params)} />
      <Stack.Screen name="GroupMemberList" component={GroupMemberList}  options={modalOption(params)}/>
      <Stack.Screen name="SelectFriend" component={SelectFriend} options={modalOption(params)} />
      <Stack.Screen name="Register" component={Register} options={modalOption(params)} />
      <Stack.Screen name="Login" component={Login} options={modalOption(params)} />
      <Stack.Screen name="ToggleAccount" component={ToggleAccount} options={modalOption(params)} />
      <Stack.Screen name="GetBack" component={GetBack} options={modalOption(params)} />
      <Stack.Screen name="SampleMap" component={SampleMap} options={modalOption(params)} />

      {/** 地图页面中跳转到以下界面 */}
      <Stack.Screen name="MyDatasource_InMap" component={MyDatasource} options={modalOption(params)} />
      <Stack.Screen name="MyDataset_InMap" component={MyDataset} options={modalOption(params)} />
      <Stack.Screen name="NewDataset_InMap" component={NewDataset} options={modalOption(params)} />
      {/** 非地图页面跳转到以下界面 */}
      <Stack.Screen name="MyDatasource" component={MyDatasource} options={modalOption(params)} />
      <Stack.Screen name="MyDataset" component={MyDataset} options={modalOption(params)} />
      <Stack.Screen name="NewDataset" component={NewDataset} options={modalOption(params)} />

      <Stack.Screen name="MyLocalData" component={MyLocalData} options={modalOption(params)} />
      <Stack.Screen name="MyMap" component={MyMap} options={modalOption(params)} />
      <Stack.Screen name="MyARMap" component={MyARMap} options={modalOption(params)} />
      <Stack.Screen name="MyARModel" component={MyARModel} options={modalOption(params)} />
      <Stack.Screen name="MyAREffect" component={MyAREffect} options={modalOption(params)} />
      <Stack.Screen name="MyScene" component={MyScene} options={modalOption(params)} />
      <Stack.Screen name="MySymbol" component={MySymbol} options={modalOption(params)} />
      <Stack.Screen name="MyTemplate" component={MyTemplate} options={modalOption(params)} />
      <Stack.Screen name="MyColor" component={MyColor} options={modalOption(params)} />
      <Stack.Screen name="SearchMine" component={SearchMine} options={modalOption(params)} />
      <Stack.Screen name="MyService" component={MyService} options={modalOption(params)} />
      <Stack.Screen name="MyOnlineMap" component={MyOnlineMap} options={modalOption(params)} />
      <Stack.Screen name="MyApplet" component={MyApplet} options={modalOption(params)} />
      <Stack.Screen name="AppletManagement" component={AppletManagement} options={modalOption(params)} />
      <Stack.Screen name="AppletList" component={AppletList} options={modalOption(params)} />
      <Stack.Screen name="MyAIModel" component={MyAIModel} options={modalOption(params)} />
      <Stack.Screen name="MySandTable" component={MySandTable} options={modalOption(params)} />
      <Stack.Screen name="ScanOnlineMap" component={ScanOnlineMap} options={modalOption(params)} />
      <Stack.Screen name="Personal" component={Personal} options={modalOption(params)} />
      <Stack.Screen name="WebView" component={WebView} options={modalOption(params)} />
      <Stack.Screen name="AboutITablet" component={AboutITablet} options={modalOption(params)} />
      <Stack.Screen name="LicensePage" component={LicensePage} options={modalOption(params)} />
      <Stack.Screen name="LicenseTypePage" component={LicenseTypePage} options={modalOption(params)} />
      <Stack.Screen name="LicenseModule" component={LicenseModule} options={modalOption(params)} />
      <Stack.Screen name="LicenseJoin" component={LicenseJoin} options={modalOption(params)} />
      <Stack.Screen name="LicenseJoinCloud" component={LicenseJoinCloud} options={modalOption(params)} />
      <Stack.Screen name="LoginCloud" component={LoginCloud} options={modalOption(params)} />
      <Stack.Screen name="LicenseJoinPrivateCloud" component={LicenseJoinPrivateCloud} options={modalOption(params)} />
      <Stack.Screen name="ConnectServer" component={ConnectServer} options={modalOption(params)} />
      <Stack.Screen name="LicenseJoinEducation" component={LicenseJoinEducation} options={modalOption(params)} />
      <Stack.Screen name="Setting" component={Setting} options={modalOption(params)} />
      <Stack.Screen name="LanguageSetting" component={LanguageSetting} options={modalOption(params)} />
      <Stack.Screen name="LocationSetting" component={LocationSetting} options={modalOption(params)} />
      <Stack.Screen name="Protocol" component={Protocol} options={modalOption(params)} />
      <Stack.Screen name="PublicMap" component={PublicMap} options={modalOption2(params)} />
      <Stack.Screen name="PointAnalyst" component={PointAnalyst} options={modalOption(params)}/>
      <Stack.Screen name="FriendMap" component={FriendMap} options={modalOption(params)} />
      <Stack.Screen name="MyLabel" component={MyLabel} options={modalOption(params)} />
      <Stack.Screen name="MyBaseMap" component={MyBaseMap} options={modalOption2(params)} />
      <Stack.Screen name="LoadServer" component={LoadServer} options={modalOption(params)} />
      <Stack.Screen name="SuperMapKnown" component={SuperMapKnown} options={modalOption(params)} />
      <Stack.Screen name="PublicData" component={PublicData} options={modalOption(params)} />
      <Stack.Screen name="Applet" component={Applet} options={modalOption(params)} />
      <Stack.Screen name="CoworkManagePage" component={CoworkManagePage} options={modalOption2(params)} />
      <Stack.Screen name="FindSettingPage" component={FindSettingPage} options={modalOption(params)} />
      <Stack.Screen name="Laboratory" component={Laboratory} options={modalOption(params)} />
      <Stack.Screen name="MediaEdit" component={MediaEdit} options={modalOption(params)} />
      <Stack.Screen name="Camera" component={Camera} options={{
        headerShown: false,
        animation: 'none',
        presentation: 'containedTransparentModal',
      }} />
      <Stack.Screen name="SelectLocation" component={SelectLocation} options={modalOption(params)} />
      <Stack.Screen name="ClassifyView" component={ClassifyView} options={modalOption(params)} />
      <Stack.Screen name="ModelChoseView" component={ModelChoseView} options={modalOption(params)} />
      <Stack.Screen name="ClassifyResultEditView" component={ClassifyResultEditView} options={modalOption(params)} />
      <Stack.Screen name="EnterDatumPoint" component={EnterDatumPoint} options={modalOption(params)} />
      <Stack.Screen name="CollectSceneFormSet" component={CollectSceneFormSet} options={modalOption(params)} />
      <Stack.Screen name="ClassifySettingsView" component={ClassifySettingsView} options={modalOption(params)} />
      <Stack.Screen name="AIDetectSettingView" component={AIDetectSettingView} options={modalOption(params)} />
      <Stack.Screen name="AISelectModelView" component={AISelectModelView} options={modalOption(params)} />
      <Stack.Screen name="IllegallyParkView" component={IllegallyParkView} options={modalOption(params)} />
      <Stack.Screen name="AIPoseEstimationView" component={AIPoseEstimationView} options={modalOption(params)} />
      <Stack.Screen name="AIGestureBoneView" component={AIGestureBoneView} options={modalOption(params)} />
      <Stack.Screen name="ChooseTaggingLayer" component={ChooseTaggingLayer} options={modalOption(params)} />
      <Stack.Screen name="ChooseNaviLayer" component={ChooseNaviLayer} options={modalOption(params)} />
      <Stack.Screen name="ChooseNaviDataImport" component={ChooseNaviDataImport} options={modalOption(params)} />
      <Stack.Screen name="ARNavigationView" component={ARNavigationView} options={modalOption(params)} />
      <Stack.Screen name="ChooseWeather" component={ChooseWeather} options={modalOption(params)} />
      <Stack.Screen name="SuggestionFeedback" component={SuggestionFeedback} options={modalOption(params)} />
      <Stack.Screen name="BufferAnalystView" component={BufferAnalystView} options={modalOption(params)} />
      <Stack.Screen name="AnalystRadiusSetting" component={AnalystRadiusSetting} options={modalOption(params)} />
      <Stack.Screen name="AnalystListEntry" component={AnalystListEntry} options={modalOption(params)} />
      <Stack.Screen name="OverlayAnalystView" component={OverlayAnalystView} options={modalOption(params)} />
      <Stack.Screen name="OnlineAnalystView" component={OnlineAnalystView} options={modalOption(params)} />
      <Stack.Screen name="IServerLoginPage" component={IServerLoginPage} options={modalOption(params)} />
      <Stack.Screen name="SourceDatasetPage" component={SourceDatasetPage} options={modalOption(params)} />
      <Stack.Screen name="AnalystRangePage" component={AnalystRangePage} options={modalOption(params)} />
      <Stack.Screen name="WeightAndStatistic" component={WeightAndStatistic} options={modalOption(params)} />
      <Stack.Screen name="LocalAnalystView" component={LocalAnalystView} options={modalOption(params)} />
      <Stack.Screen name="ReferenceAnalystView" component={ReferenceAnalystView} options={modalOption(params)} />
      <Stack.Screen name="RegistrationDatasetPage" component={RegistrationDatasetPage} options={modalOption(params)} />
      <Stack.Screen name="RegistrationReferDatasetPage" component={RegistrationReferDatasetPage} options={modalOption(params)} />
      <Stack.Screen name="RegistrationArithmeticPage" component={RegistrationArithmeticPage} options={modalOption(params)} />
      <Stack.Screen name="RegistrationExecutePage" component={RegistrationExecutePage} options={modalOption(params)} />
      <Stack.Screen name="ProjectionTransformationPage" component={ProjectionTransformationPage} options={modalOption(params)} />
      <Stack.Screen name="SourceCoordsPage" component={SourceCoordsPage} options={modalOption(params)} />
      <Stack.Screen name="ProjectionParameterSetPage" component={ProjectionParameterSetPage} options={modalOption(params)} />
      <Stack.Screen name="ProjectionTargetCoordsPage" component={ProjectionTargetCoordsPage} options={modalOption(params)}/>
      <Stack.Screen name="RegistrationFastPage" component={RegistrationFastPage} options={modalOption(params)} />
      <Stack.Screen name="RegistrationPage" component={RegistrationPage} options={modalOption(params)} />
      <Stack.Screen name="InterpolationAnalystView" component={InterpolationAnalystView} options={modalOption(params)} />
      <Stack.Screen name="InterpolationAnalystDetailView" component={InterpolationAnalystDetailView} />
      <Stack.Screen name="SecondMapSettings" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings1" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings2" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings3" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings4" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings5" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings6" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="SecondMapSettings7" component={SecondMapSettings} options={modalOption(params)} />
      <Stack.Screen name="NavigationView" component={NavigationView} options={modalOption(params)} />
      <Stack.Screen name="NavigationDataChangePage" component={NavigationDataChangePage} options={modalOption(params)} />
      <Stack.Screen name="CreateNavDataPage" component={CreateNavDataPage} options={modalOption(params)} />
      <Stack.Screen name="CollectSceneFormHistoryView" component={CollectSceneFormHistoryView} options={modalOption(params)} />
      <Stack.Screen name="CustomModePage" component={CustomModePage} options={modalOption(params)} />
      <Stack.Screen name="ARLayerManager" component={ARLayerManager} options={modalOption(params)}/>
      <Stack.Screen name="ARMapSetting" component={ARMapSetting} options={modalOption(params)}/>
      <Stack.Screen name="ServiceShareSettings" component={ServiceShareSettings} />
      <Stack.Screen name="NavigationView2D" component={NavigationView2D} options={modalOption(params)} />
      <Stack.Screen name="RoadNet" component={RoadNet} options={modalOption(params)} />
      <Stack.Screen name="Report" component={Report} options={modalOption(params)} />
      {/* <Stack.Screen name="ImagePickerStack" component={ImagePickerStack} options={{
        headerShown: false,
        animation: 'slide_from_bottom',
        presentation: 'containedTransparentModal',
      }} /> */}
      <Stack.Screen name={'AlbumListPage'} component={ImagePicker.AlbumListView} options={{
        headerShown: false,
        animation: 'slide_from_bottom',
        presentation: 'containedTransparentModal',
      }} />
      <Stack.Screen name={'AlbumViewPage'} component={ImagePicker.AlbumView} options={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        presentation: 'containedTransparentModal',
      }} />
      <Stack.Screen name="MapSelectList" component={MapSelectList} options={modalOption(params)}/>
      <Stack.Screen name="ChartManager" component={ChartManager} options={modalOption(params)} />
      <Stack.Screen name="ExternalDevices" component={ExternalDevices} options={modalOption(params)} />
      <Stack.Screen name="BluetoothDevices" component={BluetoothDevices} options={modalOption(params)} />
      <Stack.Screen name="NtripSetting" component={NtripSetting} options={modalOption(params)} />
      <Stack.Screen name="ARAnimation" component={ARAnimation} options={modalOption(params)} />
      <Stack.Screen name="AttributeDetail" component={AttributeDetail} options={modalOption(params)} />
    </Stack.Navigator>
  )
}