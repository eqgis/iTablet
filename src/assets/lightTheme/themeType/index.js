const theme_graph_area = require('./icon_layer_areamap.png')
const theme_graph_step = require('./icon_layer_stairs.png')
const theme_graph_line = require('./icon_layer_linechart.png')
const theme_graph_point = require('./icon_layer_scatter_plot.png')
const theme_graph_bar = require('./icon_layer_barchart.png')
const theme_graph_bar3d = require('./icon_layer_3dbarchart.png')
const theme_graph_pie = require('./icon_layer_piechart.png')
const theme_graph_pie3d = require('./icon_layer_3dpiechart.png')
const theme_graph_rose = require('./icon_layer_rose.png')
const theme_graph_rose3d = require('./icon_layer_3drose.png')
const theme_graph_stack_bar = require('./icon_layer_stacking_diagram.png')
const theme_graph_stack_bar3d = require('./icon_layer_3dstack.png')
const theme_graph_ring = require('./icon_layer_circular_graph.png')
// const theme_graph_type = require('./theme_graph_type.png')
const theme_graph_type = require('./icon_layer_stairs.png')
const theme_graph_graduatedmode_cons = require('./theme_graph_graduatedmode_cons.png')
const theme_graph_graduatedmode_log = require('./theme_graph_graduatedmode_log.png')
const theme_graph_graduatedmode_square = require('./theme_graph_graduatedmode_square.png')
const theme_create_unify_style = require('./icon_layer_unified_style.png')
const theme_create_unique_style = require('./icon_layer_single_value.png')
const theme_create_unique_style_selected = require('./theme_create_unique_style_white.png')
const theme_create_range_style = require('./icon_layer_subsection.png')
const theme_create_range_style_selected = require('./theme_create_range_style_selected.png')
const theme_create_unify_label = require('./icon_layer_unified_label.png')
const theme_create_unify_label_selected = require('./theme_create_unify_label_selected.png')
const theme_create_unique_label = require('./icon_layer_single_value_label.png')
const theme_create_unique_label_selected = require('./theme_create_unique_label_selected.png')
const theme_create_range_label = require('./icon_layer_segment_label.png')
const theme_create_range_label_selected = require('./theme_create_range_label_selected.png')
const theme_graphmap = require('./icon_layer_graphmap.png')
const theme_graphmap_selected = require('./theme_graphmap_selected.png')
const theme_dot_density = require('./icon_layer_point_density.png')
const theme_dot_density_selected = require('./theme_dot_density_selected.png')
const theme_graduated_symbol = require('./icon_layer_grade_symbol.png')
const theme_graduated_symbol_selected = require('./theme_graduated_symbol_selected.png')
const theme_grid_range = require('./icon_layer_segmented_grid.png')
const theme_grid_range_selected = require('./theme_grid_range_selected.png')
const theme_grid_unique = require('./icon_layer_grid.png')
const theme_grid_unique_selected = require('./theme_grid_unique_selected.png')
const heatmap = require('./icon_layer_heat.png')
const heatmap_selected = require('./heatmap_selected.png')

// 专题图类型图标
export default {
  // 统计专题图
  theme_graph_area,
  theme_graph_step,
  theme_graph_line,
  theme_graph_point,
  theme_graph_bar,
  theme_graph_bar3d,
  theme_graph_pie,
  theme_graph_pie3d,
  theme_graph_rose,
  theme_graph_rose3d,
  theme_graph_stack_bar,
  theme_graph_stack_bar3d,
  theme_graph_ring,
  theme_graph_type,
  theme_graph_graduatedmode_cons,
  theme_graph_graduatedmode_log,
  theme_graph_graduatedmode_square,
  // 统一风格
  theme_create_unify_style,
  // 单值风格
  theme_create_unique_style,
  theme_create_unique_style_selected,
  // 分段风格
  theme_create_range_style,
  theme_create_range_style_selected,
  // 统一标签
  theme_create_unify_label,
  theme_create_unify_label_selected,
  // 单值标签
  theme_create_unique_label,
  theme_create_unique_label_selected,
  // 分段标签
  theme_create_range_label,
  theme_create_range_label_selected,
  // 点密度专题图
  theme_dot_density,
  theme_dot_density_selected,
  // 等级符号专题图
  theme_graduated_symbol,
  theme_graduated_symbol_selected,
  // 统计专题图类型图标
  theme_graphmap,
  theme_graphmap_selected,
  // 栅格分段和单值专题图
  theme_grid_range,
  theme_grid_range_selected,
  theme_grid_unique,
  theme_grid_unique_selected,
  // 热力图
  heatmap,
  heatmap_selected,
}
