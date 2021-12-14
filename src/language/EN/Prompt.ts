import CN from "../CN"

// Prompt
const Prompt: typeof CN.Prompt = {
  YES: "Yes",
  NO: "No",
  SAVE_TITLE: "Would you like to save your changes?",
  SAVE_DATA_TITLE: "Would you like to save data?",
  SAVE_YES: "Yes",
  SAVE_NO: "No",
  CANCEL: "Cancel",
  COMMIT: "Commit",
  REDO: "Redo",
  UNDO: "Undo",
  SHARE: "Share",
  DELETE: "Delete",
  WECHAT: "Wechat",
  BEGIN: "Begin",
  STOP: "Stop",
  FIELD_TO_PAUSE: "Failed to pause",
  WX_NOT_INSTALLED: "Did not find wechat",
  WX_SHARE_FAILED: "Failed to share to Wechat. Please check whether you have installed wechat",
  RENAME: "Rename",
  BATCH_DELETE: "Delete in Bulk",
  PREPARING: "Preparing",

  DOWNLOAD_SAMPLE_DATA: "Download the sample data?",
  DOWNLOAD_DATA: "Data Download",
  DOWNLOAD: "Download",
  DOWNLOADING: "Downloading",
  DOWNLOAD_SUCCESSFULLY: "Done",
  DOWNLOAD_FAILED: "Failed to download",
  UNZIPPING: "Decompressing",
  ONLINE_DATA_ERROR: "The network data has been corrupted and cannot be used normally",

  NO_REMINDER: "No reminder",

  LOG_OUT: "Are you sure you want to log out?",
  FAILED_TO_LOG: "Failed to Login",
  INCORRECT_USER_INFO: "Wrong account or password",
  INCORRECT_IPORTAL_ADDRESS: "Please check whether your server address is correct",

  DELETE_STOP: "Are you sure you want to delete the stop?",
  DELETE_OBJECT: "Are you sure you want to permanently delete the object?",
  DELETE_LAYER: "Are you sure you want to permanently delete the layer?",
  PLEASE_ADD_STOP: "Please add a stop",
  IMAGE_LAYER_CANNOT_BE_CURRENT_LAYER: "The image layer cannot be set to the current layer",

  CONFIRM: "Confirm",
  COMPLETE: "Complete",
  INSTALL:"Install",

  NO_PERMISSION: "Doesn\"t have permission",
  NO_PERMISSION_ALERT: "Doesn\"t have permission to run the application",
  EXIT: "Exit",
  CONTINUE: "Continue",
  REQUEST_PERMISSION: "Request Permission",

  OPENING: "Opening",

  QUIT: "Quit SuperMap iTablet?",
  MAP_LOADING: "Map Loading",
  LOADING: "Loading",
  OPEN_MAP_CONFIRM: "Whether to open the map",
  THE_MAP_IS_OPENED: "The map is opened",
  THE_MAP_IS_NOTEXIST: "The map doesn\"t exist",
  OPEN_MAP_FAILED: "Failed to open the map",
  THE_SCENE_IS_OPENED: "The scene has been opened",
  NO_SCENE_LIST: "No data",
  NO_SCENE_SELECTED: "No scene has been selected",
  SWITCHING: "Switching",
  CLOSING: "Closing",
  CLOSING_3D: "Closing",
  SAVING: "Saving",
  SWITCHING_SUCCESS: "Switched",
  ADD_SUCCESS: "Added",
  ADD_FAILED: "Failed to add",
  ADD_MAP_FAILED: "Can not add current map",
  CREATE_THEME_FAILED: "Failed to create the thematic map",
  PLEASE_ADD_DATASET: "Please add the dataset",
  PLEASE_SELECT_OBJECT: "Please select an object to edit",
  SWITCHING_PLOT_LIB: "Switching",
  NON_SELECTED_OBJ: "No object selected",
  CHANGE_BASE_MAP: "Empty base map, please change first",
  OVERRIDE_SYMBOL: "Symbol with the same id exists, please select method to add",
  OVERWRITE: "Overwrite",
  CHOOSE_DATASET: "Please select dataset",

  PLEASE_SUBMIT_EDIT_GEOMETRY: "Please submit the drawing object first to check its properties",

  SET_ALL_MAP_VISIBLE: "All visible",
  SET_ALL_MAP_INVISIBLE: "All invisible",
  LONG_PRESS_TO_SORT: "(Long press to sort)",

  PUBLIC_MAP: "Public Map",
  SUPERMAP_FORUM: "SuperMap Forum",
  SUPERMAP_KNOW: "SuperMap Know",
  SUPERMAP_GROUP: "SuperMap Group",
  INSTRUCTION_MANUAL: "Instruction Manual",
  THE_CURRENT_LAYER: "The current layer is",
  NO_BASE_MAP: "No base maps can be removed",
  ENTER_KEY_WORDS: "Please enter key words",
  SEARCHING: "Searching",
  SEARCHING_DEVICE_NOT_FOUND: "No devices were found",
  READING_DATA: "Reading Data",
  CREATE_SUCCESSFULLY: "Created",
  SAVE_SUCCESSFULLY: "Saved",
  NO_NEED_TO_SAVE: "No need to save",
  SAVE_FAILED: "Failed to save",
  ENABLE_DYNAMIC_PROJECTION: "Enable dynamic projection?",
  TURN_ON: "Yes",
  CREATE_FAILED: "Failed to create",
  INVALID_DATASET_NAME: "Invalid dataset name or the name already existed",
  SAVE_FAIL_POINT:"Length of an illegal point set. The value should be equal or bigger than 1",
  SAVE_LINE_FAIL: "Length of an illegal point set. The value should be equal or bigger than 2",
  SAVE_REGION_FAIL: "Length of an illegal point set. The value should be equal or bigger than 3",

  PLEASE_CHOOSE_POINT_LAYER: "Please select a point layer first",
  PLEASE_CHOOSE_LINE_LAYER: "Please select a line layer first",
  PLEASE_CHOOSE_REGION_LAYER: "Please select a region layer first",

  NO_PLOTTING_DEDUCTION: "No plotting list in the current map",
  DELETE_PLOTTING_DEDUCTION: "Delete the deduction?",
  NO_FLY: "No flying paths in the current scene",
  PLEASE_OPEN_SCENE: "Please open a scene",
  NO_SCENE: "No Scene",
  ADD_ONLINE_SCENE: "Add Online Scene",

  PLEASE_ENTER_TEXT: "Please enter text",
  PLEASE_SELECT_THEMATIC_LAYER: "Please select a thematic layer",
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: "The current layer cannot be styled. Please select another one",

  PLEASE_SELECT_PLOT_LAYER: "Please select or create a plot Layer",
  PLEASE_SELECT_MEDIA_LAYER: "Please select a point, CAD or plot layer",
  PLEASE_SELECT_CAD_LAYER: "Please select a CAD layer",
  DONOT_SUPPORT_ARCORE: "Install or upgrade ARCore",//need to translate
  DONOT_SUPPORT_ARENGINE: "Install or upgrade AREngine",//need to translate
  GET_SUPPORTED_DEVICE_LIST: "Get the list of supportive devices",
  PLEASE_NEW_PLOT_LAYER: "Please create a new plot layer",
  DOWNLOADING_PLEASE_WAIT: "Please wait a minute",
  DOWNLOADING_OTHERS_PLEASE_WAIT: "Please wait until other files are downloaded",
  SELECT_DELETE_BY_RECTANGLE: "Please draw a rectangle to select the objects you want to delete",

  CHOOSE_LAYER: "Choose Layer",

  COLLECT_SUCCESS: "Collected",

  SELECT_TWO_MEDIAS_AT_LEAST: "You have to select two multi-media files at least",
  DELETE_OBJ_WITHOUT_MEDIA_TIPS: "This object has no multi-media files. Do you want to delete it?",

  NETWORK_REQUEST_FAILED: "Failed to request network",

  SAVEING: "Saving",
  CREATING: "Creating",
  PLEASE_ADD_DATASOURCE: "Please add a datasource",
  NO_ATTRIBUTES: "No Attributes",
  NO_SEARCH_RESULTS: "No search results",

  READING_TEMPLATE: "Reading Template",
  SWITCHED_TEMPLATE: "Switched templates for you",
  THE_CURRENT_SELECTION: "The current selection is ",
  THE_LAYER_DOES_NOT_EXIST: "The layer does not exist",

  IMPORTING_DATA: "Importing Data",
  DATA_BEING_IMPORT: "Data is being imported",
  IMPORTING: "Importing",
  IMPORTED_SUCCESS: "Imported",
  FAILED_TO_IMPORT: "Failed to import",
  IMPORTED_3D_SUCCESS: "Successfully imported 3D",
  FAILED_TO_IMPORT_3D: "Failed to import 3D",
  DELETING_DATA: "Deleting data",
  DELETING_SERVICE: "Deleting service",
  DELETED_SUCCESS: "Deleted",
  FAILED_TO_DELETE: "Failed to delete",
  PUBLISHING: "Publishing",
  PUBLISH_SUCCESS: "Published",
  PUBLISH_FAILED: "Failed to publish",
  PUBLISH_FAILED_INFO_1: "The service has been published",
  PUBLISH_FAILED_INFO_2: "The service is being published and cannot be operated at this time",
  DELETE_CONFIRM: "Are you sure you want to delete data?",
  BATCH_DELETE_CONFIRM: "Are you sure you want to delete the selected data?",

  SELECT_AT_LEAST_ONE: "Please select at least one item",
  DELETE_MAP_RELATE_DATA: "The following map(s) will be affected. Are you sure you want to continue?",

  LOG_IN: "Logging",
  ENTER_MAP_NAME: "Please enter the map name",
  CLIP_ENTER_MAP_NAME: "Enter the map name",
  ENTER_SERVICE_ADDRESS: "Please enter the service address",
  ENTER_ANIMATION_NAME: "Please enter the animation name",
  ENTER_ANIMATION_NODE_NAME: "Please enter the animation node name",
  PLEASE_SELECT_PLOT_SYMBOL: "Please select a plot symbol",

  ENTER_NAME: "Please enter the name",
  ENTER_CAPTION: "Please enter a caption",
  CHOICE_TYPE: "Please select a type",
  INPUT_LENGTH: "Please enter the max length",
  DEFAULT_VALUE_EROROR: "The entered default value is wrong",
  SELECT_REQUIRED: "Please set whether it is required",
  DEFAULT_NAMING_SS: "The name cannot start with SS_",

  CLIPPING: "Clipping",
  CLIPPED_SUCCESS: "Clipped",
  CLIP_FAILED: "Failed to clip",

  LAYER_CANNOT_CREATE_THEMATIC_MAP: "The current layer cannot be used to create a thematic map.",

  ANALYSING: "Analyzing",
  CHOOSE_STARTING_POINT: "Choose a starting point",
  CHOOSE_DESTINATION: "Choose a destination",

  LATEST: "Latest:",
  GEOGRAPHIC_COORDINATE_SYSTEM: "Geographic Coordinate System:",
  PROJECTED_COORDINATE_SYSTEM: "Projected Coordinate System:",
  FIELD_TYPE: "Field Type:",

  PLEASE_LOGIN_AND_SHARE: "Please log in first to share",
  PLEASE_LOGIN: "Please log in",
  SHARING: "Sharing",
  SHARE_SUCCESS: "Shared",
  SHARE_FAILED: "Failed to share",
  SHARE_PREPARE: "Preparing for sharing",
  SHARE_START: "Start sharing",
  SHARE_WX_FILE_SIZE_LIMITE: "File size cannot exceeds 10M",

  EXPORTING: "Exporting",
  EXPORT_SUCCESS: "Exported",
  EXPORT_FAILED: "Failed to export",
  EXPORT_TO: "Data have been exported to:",
  REQUIRE_PRJ_1984: "PrjCoordSys of the dataset must be WGS_1984",
  EXPORT_TEMP_FAILED: "A normal map could not be output as a template",

  UNDO_FAILED: "Failed to undo",
  REDO_FAILED: "Failed to redo",
  RECOVER_FAILED: "Failed to recover",

  SETTING_SUCCESS: "Set successfully",
  SETTING_FAILED: "Failed to set",
  NETWORK_ERROR: "Network error",
  NO_NETWORK: "No Internet connection",
  CHOOSE_CLASSIFY_MODEL: "Choose Classification Model",
  USED_IMMEDIATELY: "Use it now",
  USING: "Using",
  DEFAULT_MODEL: "Default Model",
  DUSTBIN_MODEL: "Dustbin Model",
  PLANT_MODEL: "Plant Model",
  CHANGING: "Changing",
  CHANGE_SUCCESS: "Changed",
  CHANGE_FAULT: "Failed to change",
  DETECT_DUSTBIN_MODEL: "Dustbin Model",
  ROAD_MODEL: "Road Model",

  LICENSE_EXPIRED: "The trial license has expired. Do you want to continue the trial?",
  APPLY_LICENSE: "Apply License",
  APPLY_LICENSE_FIRST: "Please apply a valid license first",

  GET_LAYER_GROUP_FAILD: "Failed to get the layer group",
  TYR_AGAIN_LATER: " Please try again later",

  LOCATING: "locating",
  CANNOT_LOCATION: "Failed to locate",
  INDEX_OUT_OF_BOUNDS: "Index out of bounds",
  PLEASE_SELECT_LICATION_INFORMATION: "Please set up location",
  OUT_OF_MAP_BOUNDS: "Out of map bounds",
  CANT_USE_TRACK_TO_INCREMENT_ROAD: "The current location is out of map bounds so that you can't use track increment road",
  AFTER_COLLECT: "Please collect data by taking a picture first",

  POI: "POI",

  ILLEGAL_DATA: "Valid Data",

  UNSUPPORTED_LAYER_TO_SHARE: "Sharing of this layer is not supported yet",
  SELECT_DATASET_TO_SHARE: "Please select the dataset to share",
  ENTER_DATA_NAME: "Please enter the name of data",
  SHARED_DATA_10M: " The file over 10MB cannot be shared",

  PHIONE_HAS_BEEN_REGISTERED: "The phone number has been registered already",
  NICKNAME_IS_EXISTS: "The username already exists",
  VERIFICATION_CODE_ERROR: "Verification code is incorrect or invalid",
  VERIFICATION_CODE_SENT: "Verification code has been sent.",
  EMAIL_HAS_BEEN_REGISTERED: "The E-mail is registered",
  REGISTERING: "Registering",
  REGIST_SUCCESS: "Registered",
  REGIST_FAILED: "Failed to register",
  GOTO_ACTIVATE: "Please download the Trial License and activate it in the mailbox",
  ENTER_CORRECT_MOBILE: "Please enter the correct phone number",
  ENTER_CORRECT_EMAIL: "Please enter the correct email address",

  // Set prompts of menu
  ROTATION_ANGLE_ERROR: "Rotation angle should be between -360° and 360°",
  MAP_SCALE_ERROR: "Input error! Please enter a number",
  VIEW_BOUNDS_ERROR: "Range error! Please enter a number",
  VIEW_BOUNDS_RANGE_ERROR: "Parameter error! Both height and width of the view should be greater than zero",
  MAP_CENTER_ERROR: "Coordinate error! Both X and Y should be numbers",
  COPY_SUCCESS: "Copied successfully!",
  // Copy coordinate system
  COPY_COORD_SYSTEM_SUCCESS: "Coordinate system replication successfully",
  COPY_COORD_SYSTEM_FAIL: "Coordinate system replication failed",
  ILLEGAL_COORDSYS: "Not a supported coordinate system file",
  COPY_COORD_SYSTEM_FAIL_NO_COORD: "No coordinate systems can be copied",

  TRANSFER_PARAMS: "Please enter a number",
  PLEASE_ENTER: "Please enter ",

  REQUEST_TIMEOUT: "Request timeout",

  IMAGE_RECOGNITION_ING: "Loading",
  IMAGE_RECOGNITION_FAILED: "Image recognition failed",

  ERROR_INFO_INVALID_URL: "Invalid url",
  ERROR_INFO_NOT_A_NUMBER: "This is not a number",
  ERROR_INFO_START_WITH_A_LETTER: "The name can only start with a letter.",
  ERROR_INFO_ILLEGAL_CHARACTERS: "The name can not contain illegal characters.",
  ERROR_INFO_EMPTY: "The name can not be empty.",

  OPEN_LOCATION: "Please open Location Service in System Setting",
  REQUEST_LOCATION: "iTablet need location permission to complete the action",
  LOCATION_ERROR: "Location request failed, please try again later",

  OPEN_THRID_PARTY: "You're going to open a thirty-party app, continue?",

  FIELD_ILLEGAL: "Field illegal",
  PLEASE_SELECT_A_RASTER_LAYER: "Please select a raster layer",

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: "Please add the Datasource",
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION: "The current layer does not support modification",

  FAILED_TO_CREATE_POINT: "Failed to create point",
  FAILED_TO_CREATE_TEXT: "Failed to create text",
  FAILED_TO_CREATE_LINE: "Failed to create line",
  FAILED_TO_CREATE_REGION: "Failed to create region",
  CLEAR_HISTORY: "Clear history",
  // Navigation related
  SEARCH_AROUND: "Search around",
  GO_HERE: "Go here",
  SHOW_MORE_RESULT: "Show more results",
  PLEASE_SET_BASEMAP_VISIBLE: "Please set your basemap visible",
  NO_NETWORK_DATASETS: "The current workspace does not contain a network dataset",
  NO_LINE_DATASETS: "The current workspace does not contain a line dataset",
  NETWORK_DATASET_IS_NOT_AVAILABLE: "The current network dataset is not available",
  POINT_NOT_IN_BOUNDS: "The selected point is out of the bounds of the selected network dataset",
  POSITION_OUT_OF_MAP: "Your location is out of the bounds of the map, please use the simulate navigation",
  SELECT_DATASOURCE_FOR_NAVIGATION: "Select data for navigation",
  PLEASE_SELECT_NETWORKDATASET: "Select a network dataset first",
  PLEASE_SELECT_A_POINT_INDOOR: "Please select a indoor point",
  PATH_ANALYSIS_FAILED: "Path analysis failed! Please re-select the start and end points",
  ROAD_NETWORK_UNLINK: "Path analysis failed due to the disconnected road network from start-point to end-point",
  CHANGE_TO_OUTDOOR: "Switch to outdoor?",
  CHANGE_TO_INDOOR: "Switch to indoor?",
  SET_START_AND_END_POINTS: "Please set the start and end points first",
  SELECT_LAYER_NEED_INCREMENTED: "Please select the layer that needs to be incremented",
  SELECT_THE_FLOOR: "Please select the floor where the layer is located",
  LONG_PRESS_ADD_START: "Please long press to add a starting point",
  LONG_PRESS_ADD_END: "Please long press to add a destination",
  TOUCH_TO_ADD_END: "Please click to add a destination",
  ROUTE_ANALYSING: "Analyzing",
  DISTANCE_ERROR: "The destination is too close to the start point. Please reselect!",
  USE_ONLINE_ROUTE_ANALYST: "Points are out of the bounds of the network dataset. Or, there are no road nets around points. Do you want to use online route analyst?",
  NOT_SUPPORT_ONLINE_NAVIGATION: "Online navigation is not support yet.",
  CREATE: "New",
  NO_DATASOURCE: "There is no datasource in the current workspace, please create a new datasource first",
  FLOOR: "Floor",
  AR_NAVIGATION: "AR Navi",
  ARRIVE_DESTINATION: "Arrived the destination",
  DEVIATE_NAV_PATH: "Deviated from the navigation path",

  //Incremental network
  SELECT_LINE_DATASET: "Please select a line dataset first",
  CANT_UNDO: "Irrevocable",
  CANT_REDO: "Can't redo",
  DATASET_RENAME_FAILED: "The dataset name can only contain letters, numbers and \"_\", \"@\", \"#\"",
  DATASOURCE_RENAME_FAILED: "The datasource name can only contain letters, numbers and \"_\", \"@\", \"#\"",
  SWITCH_LINE: "Switch dataset",
  HAS_NO_ROADNAME_FIELD_DATA: "Dataset without road name field info",
  NOT_LONGITUDE:"Select data set projection coordinates not latitude and longitude coordinates, please convert",//need to translate
  MERGE_SUCCESS: "Merged successfully",
  MERGE_FAILD: "Merge failed",
  NOT_SUPPORT_PRJCOORDSYS: "The coordinate system of the following data set does not support merging",
  MERGEING: "Merging",
  NEW_NAV_DATA: "Create Navigation Data",
  INPUT_MODEL_FILE_NAME: "Please enter a model file name",
  SELECT_DESTINATION_DATASOURCE: "Please select the target datasource",
  FILENAME_ALREADY_EXIST: "The file already exists, please re-enter the file name",
  NETWORK_BUILDING: "Building...",
  BUILD_SUCCESS: "Successfully built",
  SELECT_LINE_SMOOTH: "Please select the line that needs to be smoothed",
  SELECT_A_POINT_INLINE: "Please select an online point",
  SELECT_POINT_INCURRENTLINE:"Select the point on the current line to interrupt",//need to translate
  SELECT_LINE_WITH_INTERRUPT:"Select the line to participate in the interruption",//need to translate
  SELECT_LINE_EXTENSION:"Select the line to be extended",//need to translate
  SELECT_LINE_TO_TRIM:"Select the clipped portion of the clipped line",//need to translate
  LINE_DATASET: "Line Dataset",
  DESTINATION_DATASOURCE: "Target Datasource",
  SMOOTH_FACTOR: "Please enter smoothing factor",
  SELECT_EXTEND_LINE: "Please select the line that needs to be extended",
  SELECT_SECOND_LINE: "Please select the second line",
  SELECT_TRIM_LINE: "Please select the line to be trimmed",
  SELECT_BASE_LINE: "Please select a baseline",
  SELECT_RESAMPLE_LINE: "Please select the line that needs to be re-sampled",
  SELECT_CHANGE_DIRECTION_LINE: "Please select the line that needs to change direction",
  EDIT_SUCCESS: "Successful operation",
  EDIT_FAILED: "Operation failed",
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: "Smoothing coefficient should be 2 ~ 10 integers",
  CONFIRM_EXIT: "Are you sure to exit?",
  TOPO_EDIT_END: "Are you finished editing and exit?",
  // Customized Thematic Map
  ONLY_INTEGER: "Only integers can be entered!",
  ONLY_INTEGER_GREATER_THAN_2: "Only integers greater than 2 can be entered!",
  PARAMS_ERROR: "Params error! Failed to set!",

  SPEECH_TIP: "You may say:\n'Zoom in'，'Zoom out'，'Locate'，'Close',\n 'Search' or any Address",
  SPEECH_ERROR: "Recognize error, please try again later",
  SPEECH_NONE: "You didn't seem to speak anything",
  SPEECH_KEYWORD: "You may say some keywords like:\n Address, Features",

  NOT_SUPPORT_STATISTIC: "The field can not be counted",
  ATTRIBUTE_DELETE_CONFIRM: "Are you sure you want to delete this attribute field?",
  ATTRIBUTE_DELETE_TIPS: "The attribute can not be recovered once you delete it",
  ATTRIBUTE_DELETE_SUCCESS: "Deleted attribute fields",
  ATTRIBUTE_DELETE_FAILED: "Failed to delete attribute fields",
  ATTRIBUTE_ADD_SUCCESS: "Added attributes",
  ATTRIBUTE_ADD_FAILED: "Failed to add attributes",
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: "Default value is null",

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: "Cannot collect data on a thematic layer",
  CANNOT_COLLECT_IN_CAD_LAYERS: "Cannot collect data on a CAD layer",
  CANNOT_COLLECT_IN_TEXT_LAYERS: "Cannot collect data on a Text layer",
  HEAT_MAP_DATASET_TYPE_ERROR: "Only the point dataset can be created",

  INVALID_DATA_SET_FAILED: "Invalid data type. Failed to set",
  INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT: "The layer is invisible, and so you cannot set it to the current layer",

  //3D Pipeline related content
  FILE_NOT_EXISTS: "Data does not exist. Please download the Sample data",
  MOVE_PHONE_ADD_SCENE: "Please move your phone slowly. Click on your screen to add a scene after recognizing a plane",
  IDENTIFY_TIMEOUT: "The image recognition fails because of a timeout. Do you want to try again?",
  TRACKING_LOADING: "Tracking...",
  UNSELECTED_OBJECT: "Unselected object!",

  // Load thematic map    output xml
  SUCCESS: "Successfully operated",
  FAILED: "The operation failed",
  NO_TEMPLATE: "No templates are available",
  CONFIRM_LOAD_TEMPLATE: "Are you sure you want to load the template?",
  CONFIRM_OUTPUT_TEMPLATE: "Are you sure you want to output the map?",

  SHOW_AR_SCENE_NOTIFY: "Show Tips of AR Scene Detection",

  CANT_PICTURE:"You could add 9 pictures at most",
}

export { Prompt }
