import CN from '../CN'

const Analyst_Modules: typeof CN.Analyst_Modules = {
  BUFFER_ANALYSIS: 'Buffer Analysis',
  BUFFER_ANALYSIS_2: 'Buffer Analysis',
  BUFFER_ANALYST_SINGLE: 'Buffer Analysis',
  BUFFER_ANALYST_MULTIPLE: 'Multi-Buffer Analysis',
  OVERLAY_ANALYSIS: 'Overlay Analysis',
  THIESSEN_POLYGON: 'Thiessen Polygon',
  MEASURE_DISTANCE: 'Measure Distance',
  ONLINE_ANALYSIS: 'Online Analysis',
  INTERPOLATION_ANALYSIS: 'Interpolation Analysis',

  OPTIMAL_PATH: 'Optimal Path',
  CONNECTIVITY_ANALYSIS: 'Connectivity Analysis',
  FIND_TSP_PATH: 'Find TSP Path',
  TRACING_ANALYSIS: 'Tracing Analysis',

  REGISTRATION_CREATE: 'New Registration',
  REGISTRATION_SPEEDINESS: 'Rapid Registration',
  PROJECTION_TRANSFORMATION: 'Projection Transformation',
}

const Analyst_Methods: typeof CN.Analyst_Methods = {
  CLIP: 'Clip',
  UNION: 'Union',
  ERASE: 'Erase',
  INTERSECT: 'Intersect',
  IDENTITY: 'Identity',
  XOR: 'XOR',
  UPDATE: 'Update',

  DENSITY: 'Density Analysis',
  AGGREGATE_POINTS_ANALYSIS: 'Aggregate Points Analysis',
}

const Analyst_Labels: typeof CN.Analyst_Labels = {
  ANALYST: 'Analyze',
  CONFIRM: 'Done',
  RESET: 'Reset',
  CANCEL: 'Cancel',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  ADD: 'Add',
  Edit: 'Edit',

  // local
  USE_AN_EXISTING_NETWORK_DATASET: 'Use An Existing Network Dataset',
  BUILD_A_NETWORK_DATASET: 'Build A Network Dataset',
  CHOOSE_DATA: 'Choose Data',
  TOPOLOGY: 'Topology',
  ADD_DATASET: 'Add Dataset',
  DONE: 'Done',
  RESULT_FIELDS: 'Result Fields',
  SPLIT_SETTINGS: 'Split Settings',
  SPLIT_LINE_BY_POINT: 'Split Line by Point',
  SPLIT_LINES_AT_INTERSECTION: 'Split Lines at Intersection',

  SET_START_STATION: 'Set Start Station',
  MIDDLE_STATIONS: 'Middle Stations',
  SET_END_STATION: 'Set End Station',
  LOCATION: 'Location',
  SET_AS_START_STATION: 'Starting Point',
  SET_AS_END_STATION: 'Destination',
  ADD_STATIONS: 'Add Stations',
  ADD_BARRIER_NODES: 'Add Barrier Nodes',
  ADD_NODES: 'Add Nodes',
  UPSTREAM_TRACKING: 'Upstream Tracking',
  DOWNSTREAM_TRACKING: 'Downstream Tracking',
  CLEAR: 'Clear',
  START_STATION: 'Start Station',
  MIDDLE_STATION: 'Middle Station',
  END_STATION: 'End Station',
  BARRIER_NODE: 'Barrier Node',
  NODE: 'Node',

  BUFFER_ZONE: 'Buffer',
  MULTI_BUFFER_ZONE: 'Multi-buffer',
  DATA_SOURCE: 'Datasource',
  DATA_SET: 'Dataset',
  SELECTED_OBJ_ONLY: 'Selected Objects Only',
  BUFFER_TYPE: 'Buffer Type',
  BUFFER_ROUND: 'Round',
  BUFFER_FLAT: 'Flat',
  BUFFER_RADIUS: 'Radius',
  RESULT_SETTINGS: 'Result Settings',
  BUFFER_UNION: 'Union Buffer',
  KEEP_ATTRIBUTES: 'Keep Attributes',
  DISPLAY_IN_MAP: 'Display in Map',
  DISPLAY_IN_SCENE: 'Display in Scene',
  SEMICIRCLE_SEGMENTS: 'Semicircle Segments',
  RING_BUFFER: 'Ring Buffer',
  RESULT_DATA: 'Result Data',
  BATCH_ADD: 'Batch Add',
  START_VALUE: 'Start Value',
  END_VALUE: 'End Value',
  STEP: 'Step',
  RANGE_COUNT: 'Range Count',
  INSERT: 'Insert',
  DELETE: 'Delete',
  INDEX: 'Index',
  RADIUS: 'Radius',
  RESULT_DATASET_NAME: 'Name of Result Dataset',
  GO_TO_SET: 'Go to set',

  SOURCE_DATA: 'Source Data',
  OVERLAY_DATASET: 'Overlay Dataset',
  SET_FIELDS: 'Set Fields',
  FIELD_NAME: 'Field Name',

  ISERVER_LOGIN: 'Login iServer',
  ISERVER: 'iServer URL',
  SOURCE_DATASET: 'Source Dataset',

  ANALYSIS_PARAMS: 'Analysis Parameters',
  ANALYSIS_METHOD: 'Analysis Method',
  Mesh_Type: 'Mesh Type',
  WEIGHT_FIELD: 'Weight Field',
  ANALYSIS_BOUNDS: 'Analysis Bounds',
  MESH_SIZE: 'Mesh Size',
  SEARCH_RADIUS: 'Radius',
  AREA_UNIT: 'Area Units',
  STATISTIC_MODE: 'Statistic Mode',
  NUMERIC_PRECISION: 'Numeric Precision',
  AGGREGATE_TYPE: 'Aggregate Type',

  THEMATIC_PARAMS: 'Thematic Parameters',
  INTERVAL_MODE: 'Interval Mode',
  NUMBER_OF_SEGMENTS: 'Number of Segments',
  COLOR_GRADIENT: 'Color Gradient Mode',

  Input_Type: 'Input Type',
  Dataset: 'Dataset',

  NOT_SET: 'Not Set',
  ALREADY_SET: 'Already Set',

  ADD_WEIGHT_STATISTIC: 'Add Weighted Field',

  // 方向
  LEFT: 'Left',
  DOWN: 'Down',
  RIGHT: 'Right',
  UP: 'Up',

  // 邻近分析
  DISPLAY_REGION_SETTINGS: 'Display Region Settings',
  CUSTOM_LOCALE: 'Custom Locale',
  SELECT_REGION: 'Select Region',
  DRAW_REGION: 'Draw Region',
  MEASURE_DISTANCE: 'Measure Distance',
  REFERENCE_DATASET: 'Reference Dataset',
  PARAMETER_SETTINGS: 'Parameter Settings',
  MEASURE_TYPE: 'Measure Type',
  MIN_DISTANCE_2: 'Min Distance',
  DISTANCE_IN_RANGE: 'Distance in Range',
  QUERY_RANGE: 'Query Range',
  MIN_DISTANCE: 'Min Distance',
  MAX_DISTANCE: 'Max Distance',
  ASSOCIATE_BROWSING_RESULT: 'Associate Browsing Result',

  // 插值分析
  INTERPOLATION_METHOD: 'Interpolation Analysis',
  INTERPOLATION_FIELD: 'Interpolation Methods',
  SCALE_FACTOR: 'Scale Factor',
  RESOLUTION: 'Resolution',
  PIXEL_FORMAT: 'Pixel Format',
  INTERPOLATION_BOUNDS: 'Bounds',
  SAMPLE_POINT_SETTINGS: 'Sample Point Settings',
  SEARCH_MODE: 'Search Mode',
  MAX_RADIUS: 'Max Radius',
  SEARCH_RADIUS_2: 'Search Radius',
  SEARCH_POINT_COUNT: 'Point Count',
  MIX_COUNT: 'Min Count',
  MOST_INVOLVED: 'Most Involved',
  MOST_IN_BLOCK: 'Most in Block',
  OTHER_PARAMETERS: 'Other Parameters',
  POWER: 'Power',
  TENSION: 'Tension',
  SMOOTHNESS: 'Smoothness',
  SEMIVARIOGRAM: 'Semivariogram',
  ROTATION: 'Rotation',
  SILL: 'Sill',
  RANGE: 'Range',
  NUGGET_EFFECT: 'Nugget Effect',
  MEAN: 'Mean',
  EXPONENT: 'Exponent',
  HISTOGRAM: 'Histogram',
  FUNCTION: 'Function',
  SHOW_STATISTICS: 'Show Statistics',
  EXPORT_TO_ALBUM: 'Export to Album',

  REGISTRATION_DATASET: 'Registration dataset',
  REGISTRATION_REFER_DATASET_ADD: 'Registration refer dataset add',
  REGISTRATION: 'Registration',
  REGISTRATION_ARITHMETIC: 'Registration arithmetic',
  REGISTRATION_LINE: 'Registration line (at least 4 control points)',
  REGISTRATION_QUADRATIC: 'Registration quadratic (at least 7 control points)',
  REGISTRATION_RECTANGLE: 'Registration rectangle (2 control points)',
  REGISTRATION_OFFSET: 'Registration offset (1 control points)',
  REGISTRATION_LINE_: 'Registration line',
  REGISTRATION_QUADRATIC_: 'Registration quadratic',
  REGISTRATION_RECTANGLE_: 'Registration rectangle',
  REGISTRATION_OFFSET_: 'Registration offset',
  REGISTRATION_ASSOCIATION: 'Association',

  REGISTRATION_ASSOCIATION_CLOCE: 'Cancel the associated',
  REGISTRATION_EXECUTE: 'Run',
  REGISTRATION_EXECUTE_SUCCESS: 'Execute success',
  REGISTRATION_EXECUTE_FAILED: 'Execute failed',
  REGISTRATION_SAVE_AS: 'Save as',
  REGISTRATION_RESAMPLE: 'Result resampling',
  REGISTRATION_SAMPLE_MODE: 'Sampling mode',
  REGISTRATION_SAMPLE_MODE_NO: 'No',
  REGISTRATION_SAMPLE_MODE_NEAR: 'The method of adjacent',
  REGISTRATION_SAMPLE_MODE_BILINEARITY: 'Bilinear interpolation',
  REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION: 'Cubic convolution interpolation',
  REGISTRATION_SAMPLE_PIXEL: 'Sample pixel',
  REGISTRATION_RESULT_DATASET: 'Result dataset',
  REGISTRATION_RESULT_DATASOURCE: 'Result datasource',
  REGISTRATION_ORIGINAL_DATASOURCE: 'Original dataset',
  REGISTRATION_POINTS_DETAIL: 'Detail',
  REGISTRATION_EXECUTING: 'In progress',
  REGISTRATION_ENUMBER: 'Serial number',
  REGISTRATION_ORIGINAL: 'Source',
  REGISTRATION_TAREGT: 'Target',
  REGISTRATION_RESELECT_POINT: 'Reselect point',
  REGISTRATION_EXPORT: 'Export',
  REGISTRATION_EXPORT_SUCCESS: 'Export success',
  REGISTRATION_EXPORT_FAILED: 'Export failed',
  REGISTRATION_EXPORT_FILE_NAME: 'Export file name',
  REGISTRATION_EXPORT_FILE: 'Registration info file',
  REGISTRATION_PLEASE_SELECT: 'Please select',
  REGISTRATION_NOT_SETLECT_DATASET: 'Please select a registration dataset',
  REGISTRATION_NOT_SETLECT_REFER_DATASET: 'Please select a reference dataset',
  //投影转换
  PROJECTION_SOURCE_COORDS: 'Source Coords',
  PROJECTION_COORDS_NAME: 'Coords Name',
  PROJECTION_COORDS_UNIT: 'Coords Unit',
  PROJECTION_GROUND_DATUM: 'Ground Datum',
  PROJECTION_REFERENCE_ELLIPSOID: 'Reference Ellipsoid',

  PROJECTION_CONVERT_SETTING: 'Reference system conversion settings',
  PROJECTION_CONVERT_MOTHED: 'Convert method',
  PROJECTION_PARAMETER_SETTING: 'Parameter Setting',
  BASIC_PARAMETER: 'Basic Parameter',
  ROTATION_ANGLE_SECOND: 'Rotation Angle (second)',
  OFFSET: 'Offset',
  RATIO_DIFFERENCE: 'Ratio Difference',
  TARGET_COORDS: 'Target Coords',
  COPY: 'Copy',
  RESETING: 'Reset',
  GEOCOORDSYS: 'Geographic coordinate system',
  PRJCOORDSYS: 'Projected coordinate system',
  COMMONCOORDSYS: 'Common coordinate system',
  CONVERTTING: 'Convertting',
  CONVERT_SUCCESS: 'Convert success',
  CONVERT_FAILED: 'Convert failed',
  ARITHMETIC: 'Arithmetic',
}

const Convert_Unit: typeof CN.Convert_Unit = {
  ///  毫米。
  MILIMETER: 'Milimeter',
  /// 平方毫米。
  SQUAREMILIMETER: 'Mm2',
  ///  厘米。
  CENTIMETER: 'cm',
  /// 平方厘米。
  SQUARECENTIMETER: 'cm2',
  /// 英寸。
  INCH: 'inch',
  /// 平方英寸。
  SQUAREINCH: 'Square inch',
  /// 分米。
  DECIMETER: 'Dm',
  /// 平方分米。
  SQUAREDECIMETER: 'Square decimetres',
  ///  英尺。
  FOOT: 'Foot',
  ///  平方英尺。
  SQUAREFOOT: 'Square feet',
  ///  码。
  YARD: 'Yard',
  ///  平方码。
  SQUAREYARD: 'Square yard',
  ///  米。
  METER: 'Meter',
  ///  平方米。
  SQUAREMETER: 'Square meter',
  /// 千米。
  KILOMETER: 'km',
  /// 平方千米。
  SQUAREKILOMETER: 'square kilometer',
  /// 平方英里。
  MILE: 'Square mile',
  /// 英里。
  SQUAREMILE: 'mile',
  ///  秒。
  SECOND: 'second',
  ///  分。
  MINUTE: 'Minute',
  ///  度。
  DEGREE: 'degree',
  /// 弧度。
  RADIAN: 'radian',
}

const Analyst_Params: typeof CN.Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: 'Left and Right',
  BUFFER_LEFT: 'Left',
  BUFFER_RIGHT: 'Right',

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: 'Simple Density Analysis',
  KERNEL_DENSITY_ANALYSIS: 'Kernel Density Analysis',

  // 网格面类型
  QUADRILATERAL_MESH: 'Quadrilateral Mesh',
  HEXAGONAL_MESH: 'Hexagonal Mesh',

  // 分段模式
  EQUIDISTANT_INTERVAL: 'Equidistant Interval',
  LOGARITHMIC_INTERVAL: 'Logarithmic Interval',
  QUANTILE_INTERVAL: 'Quantile Interval',
  SQUARE_ROOT_INTERVAL: 'Square Root Interval',
  STANDARD_DEVIATION_INTERVAL: 'Standard Deviation Interval',

  // 长度单位
  METER: 'm',
  KILOMETER: 'km',
  YARD: 'yd',
  FOOT: 'ft',
  MILE: 'mile',

  // 面积单位
  SQUARE_MILE: 'mile²',
  SQUARE_METER: 'm²',
  SQUARE_KILOMETER: 'km²',
  HECTARE: 'ha',
  ARE: 'are',
  ACRE: 'acre',
  SQUARE_FOOT: 'ft²',
  SQUARE_YARD: 'yd²',

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: 'Green Orange Purple Gradient',
  GREEN_ORANGE_RED_GRADIENT: 'Green Orange Red Gradient',
  RAINBOW_COLOR: 'Rainbow Color',
  SPECTRAL_GRADIENT: 'Spectral Gradient',
  TERRAIN_GRADIENT: 'Terrain Gradient',

  // 统计模式
  MAX: 'Max',
  MIN: 'Min',
  AVERAGE: 'Average',
  SUM: 'Sum',
  VARIANCE: 'Variance',
  STANDARD_DEVIATION: 'Standard Deviation',

  // 聚合类型
  AGGREGATE_WITH_GRID: 'Aggregate with Grid',
  AGGREGATE_WITH_REGION: 'Aggregate with Region',

  // 插值方法
  IDW: 'IDW',
  SPLINE: 'Spline',
  ORDINARY_KRIGING: 'Ordinary Kriging',
  SIMPLE_KRIGING: 'Simple Kriging',
  UNIVERSAL_KRIGING: 'Universal Kriging',

  // 像素格式
  UBIT1: 'UBIT1',
  UBIT16: 'UBIT16',
  UBIT32: 'UBIT32',
  SINGLE: 'Single',
  DOUBLE: 'Double',

  // 查找方法
  SEARCH_VARIABLE_LENGTH: 'Variable Length',
  SEARCH_FIXED_LENGTH: 'Fixed Length',
  SEARCH_BLOCK: 'Block',

  // 半变异函数
  SPHERICAL: 'Spherical',
  EXPONENTIAL: 'Exponential',
  GAUSSIAN: 'Gaussian',
}

const Analyst_Prompt: typeof CN.Analyst_Prompt = {
  ANALYSING: 'Analysing',
  ANALYSIS_START: 'Analysing',
  ANALYSIS_SUCCESS: 'Analysis successfully',
  ANALYSIS_FAIL: 'Analysis failed',
  PLEASE_CONNECT_TO_ISERVER: 'Please connect to iServer',
  PLEASE_CHOOSE_INPUT_METHOD: 'Please choose input method',
  PLEASE_CHOOSE_DATASET: 'Please choose dataset',
  LOGIN_ISERVER_FAILED: 'Failed to connect iServer, please check ip, username, and password',
  BEING_ANALYZED: 'Being analyzed',
  ANALYZING_FAILED: 'Analyzing failed',
  LOADING_MODULE: 'Module Loading',
  LOADING_MODULE_FAILED: 'Failed to load module, please check the dataset',
  TWO_NODES_ARE_CONNECTED: 'The two nodes are connected',
  TWO_NODES_ARE_NOT_CONNECTED: 'The two nodes are not connected',
  NOT_FIND_SUITABLE_PATH: 'Did not find suitable path',
  SELECT_DATA_SOURCE_FIRST: 'Please select datasource first',
  SELECT_DATA_SET_FIRST: 'Please select dataset first',
  PLEASE_SELECT_A_REGION: 'Please select a region',
  REGISTRATION_LINE_POINTS: 'Please set at least 4 control points',
  REGISTRATION_QUADRATIC_POINTS: 'Please set at least 7 control points',
  REGISTRATION_RECTANGLE_POINTS: 'Please set 2 control points',
  REGISTRATION_OFFSET_POINTS: 'Please set 1 control point',
  REGISTRATION_POINTS_NUMBER_ERROR: 'The number of control points does not match',
  ANALYSIS_SUCCESS_TOWATCH: 'The analysis was finished successfully. Do you want to check the results?',
}

export { Analyst_Modules, Analyst_Methods, Analyst_Labels, Analyst_Params, Analyst_Prompt, Convert_Unit }
