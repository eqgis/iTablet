interface IToolbarType {
  list: 'list', // 列表
  selectableList: 'selectableList', // 可选择列表，每行左方多选框
  table: 'table', // 固定表格
  scrollTable: 'scrollTable', // 纵向滚动表格
  tabs: 'tabs', // 卡片式符号库容器
  symbol: 'symbol', // 符号库容器
  colorTable: 'colorTable', // 颜色表格
  horizontalTable: 'horizontalTable', // 横向滚动表格
  createPlotAnimation: 'createPlotAnimation', // 创建标绘推演
  animationNode: 'animationNode', // 态势推演
  picker: 'picker', // 选择器
  multiPicker: 'multiPicker', // 选择器 多选
  colorPicker: 'colorPicker', //颜色选择器 色盘
  slider: 'slider', // 滚动条，可多个
  tableTabs: 'tableTabs', // 卡片表格
  typeNull: 'typeNull', //无状态 高度始终为0
  arMeasure: 'arMeasure', //ar测量新增 同级界面弹出二级菜单
}


/** 工具栏容器类型 * */
 const ToobarType: IToolbarType = {
   list: 'list', // 列表
   selectableList: 'selectableList', // 可选择列表，每行左方多选框
   table: 'table', // 固定表格
   scrollTable: 'scrollTable', // 纵向滚动表格
   tabs: 'tabs', // 卡片式符号库容器
   symbol: 'symbol', // 符号库容器
   colorTable: 'colorTable', // 颜色表格
   horizontalTable: 'horizontalTable', // 横向滚动表格
   createPlotAnimation: 'createPlotAnimation', // 创建标绘推演
   animationNode: 'animationNode', // 态势推演
   picker: 'picker', // 选择器
   multiPicker: 'multiPicker', // 选择器 多选
   colorPicker: 'colorPicker', //颜色选择器 色盘
   slider: 'slider', // 滚动条，可多个
   tableTabs: 'tableTabs', // 卡片表格
   typeNull: 'typeNull', //无状态 高度始终为0
   arMeasure: 'arMeasure', //ar测量新增 同级界面弹出二级菜单
}

export default ToobarType
