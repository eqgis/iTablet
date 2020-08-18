import { createStackNavigator } from 'react-navigation'
// eslint-disable-next-line
// import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'
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
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  MyApplet,
  MyAIModel,
  Personal,
  ToggleAccount,
  Setting,
  AboutITablet,
  Login,
  MyDataset,
  NewDataset,
  SearchMine,
  // Chat,
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
} from './tabs'

import GetBack from './register&getBack/GetBack'
// 地图二级设置菜单
import SecondMapSettings from './mapSetting/secondMapSettings'
// 地图功能页面
import MTDataCollection from './mtDataCollection'
import MTDataManagement from './mtDataManagement'
import NewDSource from './newDSource'
import { ChooseDatasource, NewDSet } from './newDSet'
import MTLayerManager from './mtLayerManager'
import Layer3DManager from './Layer3DManager'
import AnalystParams from './analystParams'
import AddLayer from './addLayer'
import ChooseEditLayer from './chooseEditLayer'
import AddDataset from './addDataset'
import AddLayerGroup from './addLayerGroup'
import MapChange from './mapChange'
import {
  LayerSelectionAttribute,
  LayerAttributeEdit,
  LayerAttributeAdd,
  LayerAttributeObj,
  LayerAttributeSearch,
  LayerAttributeStatistic,
} from './layerAttribute'
import { ThemeEntry, ThemeEdit, ChoosePage, ThemeStyle } from './theme'
import workspaceFlieList from './workspaceFileList'
// import dataSourcelist from './dataSourcelist'
import dataSets from './dataSets'
import ColorPickerPage from './colorPickerPage'
import UpLoadList from './uploadList'
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
import protocol from './tabs/Home/AboutITablet/Protocol'
import {
  LicensePage,
  LicenseTypePage,
  LicenseModule,
  LicenseJoin,
  LicenseJoinCloud,
  LicenseJoinPrivateCloud,
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
import MeasureView from './arMeasure'
import { MeasureAreaView } from './arMeasure/pages'
import ClassifyView from './aiClassifyView'
import ModelChoseView from './arModelChoseView'
import ClassifyResultEditView from './aiClassifyResultEdit'
import CollectSceneFormView from './arCollectSceneFormView'
import EnterDatumPoint from './arEnterDatumPoint/EnterDatumPoint'
import CollectSceneFormSet from './arEnterDatumPoint/CollectSceneFormSet'
import ClassifySettingsView from './ClassifySettingsView'
import IllegallyParkView from './aiIllegallyPark'
import AIDetecSettingsView from './AIDetecSettingsView'
import CastModelOperateView from './arCastModelOperateView'
import ARProjectModeView from './arProjectModel'
import ARNavigationView from './arNavigationView'
import ARVideoView from './arVideoView'
import ARWeatherView from './arWeatherView'
import ChooseWeather from './chooseWeather'
import ARImageView from './arImageView'
import AIPoseEstimationView from './aiPoseEstimationView'
import ARWebView from './arWebView'
import ARTextView from './arTextView'

import Map2Dto3D from './workspace/components/Map2Dto3D'
import NavigationView from './workspace/components/NavigationView'
import NavigationDataChangePage from './NavigationDataChangePage'
import CreateNavDataPage from './CreateNavDataPage'
import ChooseTaggingLayer from './ChooseTaggingLayer'
import LanguageSetting from './languageSetting'
import CollectSceneFormHistoryView from './arCollectSceneFormHistoryView'
import LocationSetting from './locationSetting'
import CustomModePage from './CustomModePage'
import CoworkMember from './tabs/Friend/Cowork/CoworkMember'
import CoworkMessage from './tabs/Friend/Cowork/CoworkMessage'
import {
  TemplateManager,
  TemplateDetail,
  TemplateSource,
} from './templateManager/pages'
import AppletManagement from './applet/appletManagement'
import AppletList from './applet/appletList'

export default function(appConfig) {
  return createStackNavigator(
    {
      Tabs: {
        screen: Tabs(appConfig.tabModules),
        navigationOptions: {
          header: null,
        },
      },

      MapStack: {
        screen: MapStack,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
      },
      Map3DStack: {
        screen: Map3DStack,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
      },
      MapViewSingle: {
        screen: MapView,
        navigationOptions: {
          header: null,
        },
      },
      CoworkTabs: {
        screen: CoworkTabs,
        navigationOptions: {
          header: null,
        },
      },
      CoworkMember: {
        screen: CoworkMember,
        navigationOptions: {
          header: null,
        },
      },
      CoworkMessage: {
        screen: CoworkMessage,
        navigationOptions: {
          header: null,
        },
      },
      // MapAnalystTabs: {
      //   screen: MapAnalystTabs,
      //   navigationOptions: {
      //     header: null,
      //   },
      // },

      LayerManager: {
        screen: MTLayerManager,
        navigationOptions: {
          header: null,
        },
      },
      Layer3DManager: {
        screen: Layer3DManager,
        navigationOptions: {
          header: null,
        },
      },
      DataCollection: {
        screen: MTDataCollection,
        navigationOptions: {
          header: null,
        },
      },
      DataManagement: {
        screen: MTDataManagement,
        navigationOptions: {
          header: null,
        },
      },
      NewDSource: {
        screen: NewDSource,
        navigationOptions: {
          header: null,
        },
      },
      ChooseDatasource: {
        screen: ChooseDatasource,
        navigationOptions: {
          header: null,
        },
      },
      NewDSet: {
        screen: NewDSet,
        navigationOptions: {
          header: null,
        },
      },
      ChooseEditLayer: {
        screen: ChooseEditLayer,
        navigationOptions: {
          header: null,
        },
      },
      AnalystParams: {
        screen: AnalystParams,
        navigationOptions: {
          header: null,
        },
      },
      AddLayer: {
        screen: AddLayer,
        navigationOptions: {
          header: null,
        },
      },
      AddDataset: {
        screen: AddDataset,
        navigationOptions: {
          header: null,
        },
      },
      AddLayerGroup: {
        screen: AddLayerGroup,
        navigationOptions: {
          header: null,
        },
      },
      MapChange: {
        screen: MapChange,
        navigationOptions: {
          header: null,
        },
      },
      LayerSelectionAttribute: {
        screen: LayerSelectionAttribute,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeEdit: {
        screen: LayerAttributeEdit,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeObj: {
        screen: LayerAttributeObj,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeAdd: {
        screen: LayerAttributeAdd,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeSearch: {
        screen: LayerAttributeSearch,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeStatistic: {
        screen: LayerAttributeStatistic,
        navigationOptions: {
          header: null,
        },
      },
      ThemeEntry: {
        screen: ThemeEntry,
        navigationOptions: {
          header: null,
        },
      },
      ThemeEdit: {
        screen: ThemeEdit,
        navigationOptions: {
          header: null,
        },
      },
      ChoosePage: {
        screen: ChoosePage,
        navigationOptions: {
          header: null,
        },
      },
      ThemeStyle: {
        screen: ThemeStyle,
        navigationOptions: {
          header: null,
        },
      },
      WorkspaceFileList: {
        screen: workspaceFlieList,
        navigationOptions: {
          header: null,
        },
      },
      DataSets: {
        screen: dataSets,
        navigationOptions: {
          header: null,
        },
      },
      ColorPickerPage: {
        screen: ColorPickerPage,
        navigationOptions: {
          header: null,
        },
      },
      MapCut: {
        screen: MapCut,
        navigationOptions: {
          header: null,
        },
      },
      MapCutDS: {
        screen: MapCutDS,
        navigationOptions: {
          header: null,
        },
      },

      UpLoadList: {
        screen: UpLoadList,
        navigationOptions: {
          header: null,
        },
      },
      MapToolbarSetting: {
        screen: MapToolbarSetting,
        navigationOptions: {
          header: null,
        },
      },
      TouchProgress: {
        screen: TouchProgress,
        navigationOptions: {
          header: null,
        },
      },
      InputPage: {
        screen: InputPage,
        navigationOptions: {
          header: null,
        },
      },
      InputStyledText: {
        screen: InputStyledText,
        navigationOptions: {
          header: null,
        },
      },
      AnimationNodeEditView: {
        screen: AnimationNodeEditView,
        navigationOptions: {
          header: null,
        },
      },
      AnimationNodeEditRotateView: {
        screen: AnimationNodeEditRotateView,
        navigationOptions: {
          header: null,
        },
      },
      AddOnlineScense: {
        screen: AddOnlineScense,
        navigationOptions: {
          header: null,
        },
      },
      TemplateManager: {
        screen: TemplateManager,
        navigationOptions: {
          header: null,
        },
      },
      TemplateDetail: {
        screen: TemplateDetail,
        navigationOptions: {
          header: null,
        },
      },
      TemplateSource: {
        screen: TemplateSource,
        navigationOptions: {
          header: null,
        },
      },
      /** ****************************** Friend ********************* */
      // onechat
      // Chat: {
      //   screen: Chat,
      //   navigationOptions: {
      //     header: null,
      //     gesturesEnabled: true,
      //   },
      // },
      AddFriend: {
        screen: AddFriend,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      InformMessage: {
        screen: InformMessage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      CreateGroupChat: {
        screen: CreateGroupChat,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RecommendFriend: {
        screen: RecommendFriend,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ManageFriend: {
        screen: ManageFriend,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ManageGroup: {
        screen: ManageGroup,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SelectModule: {
        screen: SelectModule,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      GroupMemberList: {
        screen: GroupMemberList,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SelectFriend: {
        screen: SelectFriend,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      /** ****************************** Mine ********************* */
      Register: {
        screen: Register,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      Login: {
        screen: Login,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ToggleAccount: {
        screen: ToggleAccount,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      GetBack: {
        screen: GetBack,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyLocalData: {
        screen: MyLocalData,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyMap: {
        screen: MyMap,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyScene: {
        screen: MyScene,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyDatasource: {
        screen: MyDatasource,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MySymbol: {
        screen: MySymbol,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyTemplate: {
        screen: MyTemplate,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyColor: {
        screen: MyColor,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyDataset: {
        screen: MyDataset,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      NewDataset: {
        screen: NewDataset,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SearchMine: {
        screen: SearchMine,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyService: {
        screen: MyService,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyOnlineMap: {
        screen: MyOnlineMap,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyApplet: {
        screen: MyApplet,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AppletManagement: {
        screen: AppletManagement,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AppletList: {
        screen: AppletList,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyAIModel: {
        screen: MyAIModel,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ScanOnlineMap: {
        screen: ScanOnlineMap,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      Personal: {
        screen: Personal,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      /** ************************** Home ************************** */
      AboutITablet: {
        screen: AboutITablet,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicensePage: {
        screen: LicensePage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicenseTypePage: {
        screen: LicenseTypePage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicenseModule: {
        screen: LicenseModule,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicenseJoin: {
        screen: LicenseJoin,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicenseJoinCloud: {
        screen: LicenseJoinCloud,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicenseJoinPrivateCloud: {
        screen: LicenseJoinPrivateCloud,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LicenseJoinEducation: {
        screen: LicenseJoinEducation,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      Setting: {
        screen: Setting,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LanguageSetting: {
        screen: LanguageSetting,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LocationSetting: {
        screen: LocationSetting,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      Protocol: {
        screen: protocol,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      PointAnalyst: {
        screen: PointAnalyst,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      PublicMap: {
        screen: PublicMap,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      FriendMap: {
        screen: FriendMap,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyLabel: {
        screen: MyLabel,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MyBaseMap: {
        screen: MyBaseMap,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LoadServer: {
        screen: LoadServer,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SuperMapKnown: {
        screen: SuperMapKnown,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      PublicData: {
        screen: PublicData,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      Applet: {
        screen: Applet,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      CoworkManagePage: {
        screen: CoworkManagePage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      /** 多媒体编辑 * */
      MediaEdit: {
        screen: MediaEdit,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      /** 相机界面 * */
      Camera: {
        screen: Camera,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MeasureView: {
        screen: MeasureView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      MeasureAreaView: {
        screen: MeasureAreaView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARProjectModeView: {
        screen: ARProjectModeView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ClassifyView: {
        screen: ClassifyView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ModelChoseView: {
        screen: ModelChoseView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ClassifyResultEditView: {
        screen: ClassifyResultEditView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      CollectSceneFormView: {
        screen: CollectSceneFormView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      EnterDatumPoint: {
        screen: EnterDatumPoint,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      CollectSceneFormSet: {
        screen: CollectSceneFormSet,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ClassifySettingsView: {
        screen: ClassifySettingsView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AIDetecSettingsView: {
        screen: AIDetecSettingsView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      IllegallyParkView: {
        screen: IllegallyParkView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AIPoseEstimationView: {
        screen: AIPoseEstimationView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ChooseTaggingLayer: {
        screen: ChooseTaggingLayer,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      CastModelOperateView: {
        screen: CastModelOperateView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARNavigationView: {
        screen: ARNavigationView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARVideoView: {
        screen: ARVideoView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARImageView: {
        screen: ARImageView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARWeatherView: {
        screen: ARWeatherView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ChooseWeather: {
        screen: ChooseWeather,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARWebView: {
        screen: ARWebView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ARTextView: {
        screen: ARTextView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SuggestionFeedback: {
        screen: SuggestionFeedback,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      /** ************************** Analyst ************************** */
      // AnalystTools: {
      //   screen: AnalystTools,
      //   navigationOptions: {
      //     header: null,
      //     gesturesEnabled: true,
      //   },
      // },
      BufferAnalystView: {
        screen: BufferAnalystView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AnalystRadiusSetting: {
        screen: AnalystRadiusSetting,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AnalystListEntry: {
        screen: AnalystListEntry,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      OverlayAnalystView: {
        screen: OverlayAnalystView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      OnlineAnalystView: {
        screen: OnlineAnalystView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      IServerLoginPage: {
        screen: IServerLoginPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SourceDatasetPage: {
        screen: SourceDatasetPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      AnalystRangePage: {
        screen: AnalystRangePage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      WeightAndStatistic: {
        screen: WeightAndStatistic,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      LocalAnalystView: {
        screen: LocalAnalystView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ReferenceAnalystView: {
        screen: ReferenceAnalystView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RegistrationDatasetPage: {
        screen: RegistrationDatasetPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RegistrationReferDatasetPage: {
        screen: RegistrationReferDatasetPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RegistrationArithmeticPage: {
        screen: RegistrationArithmeticPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RegistrationExecutePage: {
        screen: RegistrationExecutePage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ProjectionTransformationPage: {
        screen: ProjectionTransformationPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SourceCoordsPage: {
        screen: SourceCoordsPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ProjectionParameterSetPage: {
        screen: ProjectionParameterSetPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      ProjectionTargetCoordsPage: {
        screen: ProjectionTargetCoordsPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RegistrationFastPage: {
        screen: RegistrationFastPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      RegistrationPage: {
        screen: RegistrationPage,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      InterpolationAnalystView: {
        screen: InterpolationAnalystView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      InterpolationAnalystDetailView: {
        screen: InterpolationAnalystDetailView,
        navigationOptions: {
          header: null,
          gesturesEnabled: true,
        },
      },
      SecondMapSettings: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings1: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings2: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings3: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings4: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings5: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings6: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings7: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      Map2Dto3D: {
        screen: Map2Dto3D,
        navigationOptions: {
          header: null,
        },
      },
      NavigationView: {
        screen: NavigationView,
        navigationOptions: {
          header: null,
        },
      },
      NavigationDataChangePage: {
        screen: NavigationDataChangePage,
        navigationOptions: {
          header: null,
        },
      },
      CreateNavDataPage: {
        screen: CreateNavDataPage,
        navigationOptions: {
          header: null,
        },
      },
      CollectSceneFormHistoryView: {
        screen: CollectSceneFormHistoryView,
        navigationOptions: {
          header: null,
        },
      },
      CustomModePage: {
        screen: CustomModePage,
        navigationOptions: {
          header: null,
        },
      },
    },
    {
      defaultNavigationOptions: {
        gesturesEnabled: false,
      },
      navigationOptions: {
        headerBackTitle: null,
        headerTintColor: '#333333',
        showIcon: true,
        swipeEnabled: false,
        gesturesEnabled: false,
        animationEnabled: false,
        headerTitleStyle: { alignSelf: 'center' },
      },
      lazy: true,
      // mode: 'card',
      // transitionConfig: () => ({
      // screenInterpolator: StackViewStyleInterpolator.forHorizontal,
      // }),
      mode: 'modal',
      headerMode: 'none',
      transparentCard: true,
      cardStyle: {
        backgroundColor: 'transparent',
        opacity: 1,
      },
      transitionConfig: () => ({
        screenInterpolator: sceneProps => {
          const { layout, position, scene } = sceneProps
          if (
            (scene.route.routeName === 'NavigationView' ||
              scene.route.routeName === 'PointAnalyst') &&
            GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
          ) {
            return fromLeft(sceneProps)
          } else {
            const { index } = scene

            const width = layout.initWidth
            const translateX = position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [width, 0, 0],
            })
            const opacity = position.interpolate({
              inputRange: [index - 1, index - 0.99, index],
              outputRange: [0, 1, 1],
            })
            return { opacity, transform: [{ translateX: translateX }] }
          }
        },
      }),
    },
  )
}
//从左出现的组件
const fromLeft = sceneProps => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const width = layout.initWidth
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-width, 0, 0],
  })
  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  })
  return { opacity, transform: [{ translateX: translateX }] }
}

// export default (function (a) {
//   console.warn(a && JSON.stringify(a) || '0000')
//   return createAppContainer(AppNavigator([
//     "Home",
//     "Find",
//     "Mine",
//   ]))
// })()
